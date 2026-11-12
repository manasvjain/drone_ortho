"""
TERRASCOPE Backend — FastAPI Application Entry Point
AI-Powered Drone Orthophoto Analysis Platform for SVAMITVA
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routers import upload, analysis, export, models

app = FastAPI(
    title="TERRASCOPE API",
    description="AI-Powered Feature Extraction from Drone Orthophotos for SVAMITVA",
    version="1.0.0",
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload and output directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)
os.makedirs("outputs/geojson", exist_ok=True)
os.makedirs("outputs/shapefiles", exist_ok=True)
os.makedirs("outputs/masks", exist_ok=True)

# Static file serving for uploads and outputs
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# Register routers
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])
app.include_router(models.router, prefix="/api/models", tags=["Models"])


@app.get("/api/health")
async def health_check():
    return {"status": "operational", "service": "TERRASCOPE", "version": "1.0.0"}
