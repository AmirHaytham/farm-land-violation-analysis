from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# User-related models
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True

# Violation detection models
class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class ViolationDetection(BaseModel):
    violation_type: str
    confidence: float
    bounding_box: BoundingBox
    timestamp: Optional[str] = None

class RegulationMatch(BaseModel):
    regulation_id: str
    regulation_name: str
    description: str
    violation_type: str
    severity: str
    recommended_action: str

class AnalysisResult(BaseModel):
    image_path: str
    detections: List[ViolationDetection] = []
    violation_count: int
    processing_time: float  # in seconds
    location: Optional[Dict[str, Any]] = None
    matched_regulations: Optional[List[RegulationMatch]] = None
    summary: str

class DetectionResponse(BaseModel):
    id: str
    filename: str
    upload_time: str
    result: AnalysisResult

# Report generation models
class ReportRequest(BaseModel):
    analysis_id: str
    format: str = "pdf"  # pdf or geojson
    include_regulations: bool = True
    include_recommendations: bool = True

# Alert models
class AlertConfig(BaseModel):
    email_notifications: bool = False
    sms_notifications: bool = False
    violation_threshold: float = 0.7  # Confidence threshold
    alert_recipients: List[str] = []

# Dashboard statistics models
class ViolationStatistics(BaseModel):
    total_analyses: int
    total_violations: int
    violation_types: Dict[str, int]
    compliance_rate: float
    most_common_violation: str
