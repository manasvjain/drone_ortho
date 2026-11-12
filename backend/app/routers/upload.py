"""
Upload Router — Handles orthophoto ingestion and metadata extraction.
"""

import os
import uuid
import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import numpy as np

router = APIRouter()

# In-memory store for uploaded images (in production, use a database)
uploaded_images = {}

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500 MB


def extract_image_metadata(filepath: str, original_filename: str) -> dict:
    """Extract metadata from uploaded image file."""
    file_size = os.path.getsize(filepath)
    ext = os.path.splitext(original_filename)[1].lower()

    metadata = {
        "file_size": file_size,
        "file_size_readable": _format_file_size(file_size),
        "format": ext.replace(".", "").upper(),
        "has_georef": False,
        "crs": None,
        "bounds": None,
        "pixel_resolution": None,
        "transform": None,
        "num_bands": None,
    }

    # Try to open with PIL for basic info
    try:
        with Image.open(filepath) as img:
            metadata["width"] = img.width
            metadata["height"] = img.height
            metadata["mode"] = img.mode
            metadata["num_bands"] = len(img.getbands())
    except Exception:
        pass

    # Try GeoTIFF metadata extraction with rasterio
    if ext in {".tif", ".tiff"}:
        try:
            import rasterio
            with rasterio.open(filepath) as dataset:
                metadata["has_georef"] = dataset.crs is not None
                if dataset.crs:
                    metadata["crs"] = str(dataset.crs)
                metadata["bounds"] = {
                    "left": dataset.bounds.left,
                    "bottom": dataset.bounds.bottom,
                    "right": dataset.bounds.right,
                    "top": dataset.bounds.top,
                }
                metadata["width"] = dataset.width
                metadata["height"] = dataset.height
                metadata["num_bands"] = dataset.count
                if dataset.transform:
                    metadata["pixel_resolution"] = {
                        "x": abs(dataset.transform[0]),
                        "y": abs(dataset.transform[4]),
                    }
                    metadata["transform"] = list(dataset.transform)[:6]
        except ImportError:
            metadata["georef_note"] = "Rasterio not installed — GeoTIFF metadata unavailable"
        except Exception as e:
            metadata["georef_error"] = str(e)

    return metadata


def _format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable form."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


@router.post("/orthophoto")
async def upload_orthophoto(file: UploadFile = File(...)):
    """Upload an orthophoto for analysis."""
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {ext}. Supported: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Generate unique ID
    image_id = str(uuid.uuid4())[:12]
    timestamp = datetime.now().isoformat()

    # Save file
    save_dir = os.path.join("uploads", image_id)
    os.makedirs(save_dir, exist_ok=True)
    filepath = os.path.join(save_dir, file.filename)

    # Stream upload to disk
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 500 MB limit.")

    with open(filepath, "wb") as f:
        f.write(content)

    # Extract metadata
    metadata = extract_image_metadata(filepath, file.filename)

    # Store record
    record = {
        "id": image_id,
        "filename": file.filename,
        "filepath": filepath,
        "url": f"/uploads/{image_id}/{file.filename}",
        "uploaded_at": timestamp,
        "metadata": metadata,
        "status": "uploaded",
        "analysis": None,
    }
    uploaded_images[image_id] = record

    return {
        "success": True,
        "image_id": image_id,
        "filename": file.filename,
        "metadata": metadata,
        "url": record["url"],
    }


@router.get("/images")
async def list_images():
    """List all uploaded images."""
    return {"images": list(uploaded_images.values())}


@router.get("/images/{image_id}")
async def get_image(image_id: str):
    """Get details for a specific uploaded image."""
    if image_id not in uploaded_images:
        raise HTTPException(status_code=404, detail="Image not found")
    return uploaded_images[image_id]


@router.delete("/images/{image_id}")
async def delete_image(image_id: str):
    """Delete an uploaded image."""
    if image_id not in uploaded_images:
        raise HTTPException(status_code=404, detail="Image not found")

    record = uploaded_images.pop(image_id)
    # Clean up files
    import shutil
    save_dir = os.path.join("uploads", image_id)
    if os.path.exists(save_dir):
        shutil.rmtree(save_dir)

    return {"success": True, "deleted": image_id}
