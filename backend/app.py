import datetime
import json
import os
import shutil
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

# Import our custom modules
from database import Base, engine, get_db
from models.schemas import (
    AnalysisResult,
    DetectionResponse,
    RegulationMatch,
    User,
    UserCreate,
    UserLogin,
    ViolationDetection,
)
from services.auth import (
    create_access_token,
    create_user,
    get_current_user,
    get_user_by_email,
    get_user_by_username,
    get_password_hash,
    verify_password,
)
from services.geospatial import create_geojson, extract_geospatial_data
from services.violation_detection import generate_report, process_image

# Create database tables - synchronous for reliability
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="Farm Land Violation Analysis API",
    description="API for detecting agricultural land violations using satellite imagery",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create required directories if they don't exist
upload_dir = Path("./uploads")
results_dir = Path("./results")
reports_dir = Path("./reports")

for dir_path in [upload_dir, results_dir, reports_dir]:
    dir_path.mkdir(exist_ok=True)

# Mount static files directory for serving images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Farm Land Violation Analysis API"}

# User Authentication Routes
@app.post("/users/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        # Check if username already exists
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        db_email = get_user_by_email(db, email=user.email)
        if db_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        db_user = create_user(db=db, user_data=user.dict())
        
        # Create access token
        access_token_expires = datetime.timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": db_user.username}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(db_user.id),
                "username": db_user.username,
                "email": db_user.email,
                "created_at": db_user.created_at.isoformat() if db_user.created_at else None
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@app.post("/users/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    try:
        # Get user from database
        user = get_user_by_username(db, username=user_data.username)
        
        # Verify user exists and password is correct
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = datetime.timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )

# Violation Detection Routes
@app.post("/analysis/upload", response_model=DetectionResponse)
async def upload_image_for_analysis(
    file: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    region: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    # Save uploaded file
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    file_path = upload_dir / f"{file_id}{file_extension}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the image (in a real app, this would call the AI model)
    # For the prototype, we'll return mock detection results
    result = process_image(str(file_path), latitude, longitude, region)
    
    # Save results
    result_file = results_dir / f"{file_id}.json"
    with open(result_file, "w") as f:
        json.dump(result.dict(), f)
    
    return {
        "id": file_id,
        "filename": file.filename,
        "upload_time": datetime.datetime.now().isoformat(),
        "result": result
    }

@app.get("/analysis/{analysis_id}", response_model=DetectionResponse)
async def get_analysis_result(analysis_id: str, current_user: User = Depends(get_current_user)):
    result_file = results_dir / f"{analysis_id}.json"
    
    if not result_file.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis result not found"
        )
    
    with open(result_file, "r") as f:
        result_data = json.load(f)
    
    return {
        "id": analysis_id,
        "filename": result_data.get("filename", "unknown"),
        "upload_time": result_data.get("upload_time", datetime.datetime.now().isoformat()),
        "result": AnalysisResult(**result_data.get("result", {}))
    }

@app.get("/analysis/{analysis_id}/report")
async def generate_analysis_report(
    analysis_id: str, 
    format: str = "pdf",
    current_user: User = Depends(get_current_user)
):
    result_file = results_dir / f"{analysis_id}.json"
    
    if not result_file.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis result not found"
        )
    
    with open(result_file, "r") as f:
        result_data = json.load(f)
    
    if format.lower() == "geojson":
        geojson_file = reports_dir / f"{analysis_id}.geojson"
        # In a real app, this would create a proper GeoJSON file
        geojson_data = create_geojson(result_data)
        with open(geojson_file, "w") as f:
            json.dump(geojson_data, f)
        return FileResponse(
            path=geojson_file,
            filename=f"violation_report_{analysis_id}.geojson",
            media_type="application/geo+json"
        )
    else:  # Default to PDF
        pdf_file = reports_dir / f"{analysis_id}.pdf"
        # In a real app, generate an actual PDF report
        generate_report(result_data, str(pdf_file))
        return FileResponse(
            path=pdf_file,
            filename=f"violation_report_{analysis_id}.pdf",
            media_type="application/pdf"
        )

# Data Routes
@app.get("/regulations/{region}")
async def get_regulations(region: str, current_user: User = Depends(get_current_user)):
    # In a real app, fetch actual regulations from a database
    # This is mock data for the prototype
    regulations = [
        {
            "id": "reg1",
            "name": "Agricultural Land Protection Act",
            "description": "Prohibits unauthorized construction on designated farmland",
            "region": region,
            "violation_types": ["unauthorized_building", "land_use_change"]
        },
        {
            "id": "reg2",
            "name": "Forest Conservation Regulation",
            "description": "Prevents deforestation and requires permits for tree removal",
            "region": region,
            "violation_types": ["deforestation"]
        },
        {
            "id": "reg3",
            "name": "Water Resources Protection",
            "description": "Regulates changes to irrigation and water systems on farmland",
            "region": region,
            "violation_types": ["irrigation_change"]
        }
    ]
    return regulations

@app.get("/statistics/violations")
async def get_violation_statistics(current_user: User = Depends(get_current_user)):
    # Mock statistics for prototype
    return {
        "total_analyses": 157,
        "total_violations": 89,
        "violation_types": {
            "unauthorized_building": 23,
            "deforestation": 18,
            "land_use_change": 31,
            "waste_dumping": 12,
            "other": 5
        },
        "compliance_rate": 43.3,  # percentage
        "most_common_violation": "land_use_change"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
