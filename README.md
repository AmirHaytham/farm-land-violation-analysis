# Farm Land Image Violation Analysis System

An AI-powered system to automatically detect and report violations on agricultural land using satellite/aerial imagery, ensuring compliance with local regulations and promoting sustainable land use.

## Project Overview

This system uses computer vision and machine learning to identify unauthorized structures, deforestation, and land-use changes in agricultural areas. It integrates satellite imagery with historical land-use data to provide actionable insights for authorities and stakeholders.

## Software Engineering Principles

This project adheres to the following software engineering principles:

1. **Separation of Concerns**: Frontend, backend, and AI components are decoupled.
2. **SOLID Principles**: 
   - Single Responsibility: Each component has one responsibility
   - Open/Closed: Components are open for extension but closed for modification
   - Liskov Substitution: Proper inheritance and polymorphism
   - Interface Segregation: Focused interfaces
   - Dependency Inversion: High-level modules don't depend on low-level modules
3. **Clean Architecture**: Core business logic is independent of frameworks and UI
4. **RESTful Design**: API follows REST principles with proper resource naming
5. **Security by Design**: Authentication, authorization, and data encryption
6. **Test-Driven Development**: Automated tests for all components
7. **CI/CD Integration**: Automated builds, tests, and deployments
8. **Documentation**: Comprehensive API and code documentation

## System Architecture

### Frontend
- React.js with TypeScript
- Redux for state management
- Mapbox for GIS visualization
- Material-UI for components

### Backend
- Python with FastAPI
- PostgreSQL with PostGIS extension for geospatial data
- JWT authentication

### AI/ML Component (Future Integration)
- YOLOv8 for object detection
- TensorFlow for model training
- OpenCV for image processing

## Building & Running the Project

### Frontend Setup

The frontend is built using React.js with Redux for state management and Material-UI for the interface components.

**Prerequisites:**
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

**Build Steps:**

1. Navigate to the frontend directory:
   ```bash
   cd farm-land-violation-analysis/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   This will launch the application on [http://localhost:3000](http://localhost:3000)

4. For production build:
   ```bash
   npm run build
   ```
   This creates optimized files in the `build` folder for deployment

**Frontend Structure:**
- `src/components/`: Reusable UI components
- `src/pages/`: Main application pages
- `src/store/`: Redux store configuration and slices
- `src/services/`: API and utility services

**Test User Credentials:**
- Username: `demo`
- Password: `password123`

### Backend Setup

The backend is built with Python using FastAPI for the REST API server.

**Prerequisites:**
- Python 3.8 or later
- pip (Python package manager)
- PostgreSQL (optional for development with mock data)

**Build Steps:**

1. Navigate to the backend directory:
   ```bash
   cd farm-land-violation-analysis/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate on Windows
   .\venv\Scripts\activate
   
   # Activate on macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   For a simplified setup without PostgreSQL:
   ```bash
   pip install -r simplified_requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```
   This will start the API server on [http://localhost:8000](http://localhost:8000)

5. Access API documentation:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

**Backend Structure:**
- `app.py`: Main application entry point
- `models/`: Data models and schemas
- `services/`: Business logic services
- `uploads/`: Directory for uploaded images
- `results/`: Storage for analysis results

### Complete System Setup

```bash
# Clone the repository
git clone https://github.com/AmirHaytham/farm-land-violation-analysis.git

# Set up backend
cd farm-land-violation-analysis/backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# In a new terminal, set up frontend
cd ../frontend
npm install
npm start
```

## Dataset Information

The system uses a labeled dataset of satellite/aerial images containing:
- Unauthorized structures
- Deforestation
- Land-use changes
- Agricultural equipment and machinery
- Normal farmland (control samples)

See `/dataset` directory for sample data and `/docs/dataset.md` for detailed dataset information.

## License
MIT
