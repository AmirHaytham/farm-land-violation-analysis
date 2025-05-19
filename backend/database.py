import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:135790@localhost:5432/farm_land_violation"
)

# Create SQLAlchemy engine with pool_pre_ping to handle connection issues
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True  # Enable SQL query logging
)

# Create a SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# For backward compatibility with any async code
get_db_sync = get_db
async_engine = None
