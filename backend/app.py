from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Optional, Dict, Any
import os
import uuid
import json
import shutil
import datetime
from pathlib import Path

# Import our custom modules
from models.schemas import (
    UserCreate, 
    UserLogin, 
    User, 
    ViolationDetection, 
    AnalysisResult,
    DetectionResponse,
    RegulationMatch
)
from services.auth import get_password_hash, verify_password, create_access_token, get_current_user
from services.violation_detection import process_image, generate_report
from services.geospatial import extract_geospatial_data, create_geojson

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
@app.post("/users/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    # In a real application, check if user exists & save to database
    hashed_password = get_password_hash(user.password)
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password,
        "created_at": datetime.datetime.now().isoformat()
    }
    # For prototype: just return user object (would save to DB in production)
    return User(
        id=new_user["id"],
        email=new_user["email"],
        username=new_user["username"],
        created_at=new_user["created_at"]
    )

@app.post("/users/login")
async def login(user_data: UserLogin):
    # Placeholder: In real app, verify against database
    # This is just a mock response for the prototype
    token = create_access_token({"sub": user_data.username})
    return {"access_token": token, "token_type": "bearer"}

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
