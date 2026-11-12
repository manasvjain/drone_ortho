"""
Export Router — Handles GeoJSON and Shapefile export functionality.
"""

import os
import json
import zipfile
import io
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()


def generate_geojson(results: dict, feature_type: str) -> dict:
    """Generate a GeoJSON FeatureCollection from analysis results."""
    features = []

    if feature_type == "buildings" and "buildings" in results:
        for bldg in results["buildings"]["features"]:
            # Generate approximate polygon from centroid
            cx, cy = bldg["centroid"]
            side = (bldg["area_sqm"] ** 0.5) * 0.000009  # approx deg offset
            feature = {
                "type": "Feature",
                "properties": {
                    "id": bldg["id"],
                    "type": bldg["type"],
                    "area_sqm": bldg["area_sqm"],
                    "perimeter_m": bldg["perimeter_m"],
                    "confidence": bldg["confidence"],
                    "extracted_by": "TERRASCOPE",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [cx - side, cy - side],
                        [cx + side, cy - side],
                        [cx + side, cy + side],
                        [cx - side, cy + side],
                        [cx - side, cy - side],
                    ]],
                },
            }
            features.append(feature)

    elif feature_type == "roads" and "roads" in results:
        for road in results["roads"]["features"]:
            feature = {
                "type": "Feature",
                "properties": {
                    "id": road["id"],
                    "type": road["type"],
                    "length_m": road["length_m"],
                    "width_m": road["width_m"],
                    "confidence": road["confidence"],
                    "extracted_by": "TERRASCOPE",
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [78.0400 + i * 0.001, 27.1750 + (i % 2) * 0.0005]
                        for i in range(5)
                    ],
                },
            }
            features.append(feature)

    elif feature_type == "water" and "water_bodies" in results:
        for water in results["water_bodies"]["features"]:
            cx, cy = water["centroid"]
            r = (water["area_sqm"] ** 0.5) * 0.000009
            feature = {
                "type": "Feature",
                "properties": {
                    "id": water["id"],
                    "type": water["type"],
                    "area_sqm": water["area_sqm"],
                    "perimeter_m": water["perimeter_m"],
                    "confidence": water["confidence"],
                    "extracted_by": "TERRASCOPE",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [cx - r, cy], [cx, cy + r],
                        [cx + r, cy], [cx, cy - r],
                        [cx - r, cy],
                    ]],
                },
            }
            features.append(feature)

    elif feature_type == "vegetation" and "vegetation" in results:
        for veg in results["vegetation"]["features"]:
            cx, cy = veg["centroid"]
            r = (veg["area_sqm"] ** 0.5) * 0.000009
            feature = {
                "type": "Feature",
                "properties": {
                    "id": veg["id"],
                    "type": veg["type"],
                    "area_sqm": veg["area_sqm"],
                    "confidence": veg["confidence"],
                    "extracted_by": "TERRASCOPE",
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [cx - r, cy - r], [cx + r, cy - r],
                        [cx + r, cy + r], [cx - r, cy + r],
                        [cx - r, cy - r],
                    ]],
                },
            }
            features.append(feature)

    return {
        "type": "FeatureCollection",
        "features": features,
        "metadata": {
            "generated_by": "TERRASCOPE",
            "timestamp": datetime.now().isoformat(),
            "feature_type": feature_type,
            "crs": "EPSG:4326",
        },
    }


@router.get("/geojson/{feature_type}")
async def export_geojson(feature_type: str):
    """Export extracted features as GeoJSON."""
    from app.routers.analysis import DEMO_RESULTS
    valid_types = ["buildings", "roads", "water", "vegetation", "all"]
    if feature_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid type. Use: {valid_types}")

    if feature_type == "all":
        all_features = []
        for ft in ["buildings", "roads", "water", "vegetation"]:
            geojson = generate_geojson(DEMO_RESULTS, ft)
            all_features.extend(geojson["features"])
        result = {
            "type": "FeatureCollection",
            "features": all_features,
            "metadata": {
                "generated_by": "TERRASCOPE",
                "timestamp": datetime.now().isoformat(),
                "feature_type": "all",
                "crs": "EPSG:4326",
            },
        }
    else:
        result = generate_geojson(DEMO_RESULTS, feature_type)

    return StreamingResponse(
        io.BytesIO(json.dumps(result, indent=2).encode()),
        media_type="application/geo+json",
        headers={"Content-Disposition": f"attachment; filename=terrascope_{feature_type}.geojson"},
    )


@router.get("/summary")
async def export_summary():
    """Export analysis summary as JSON."""
    from app.routers.analysis import DEMO_RESULTS
    summary = {
        "platform": "TERRASCOPE",
        "timestamp": datetime.now().isoformat(),
        "buildings": {
            "count": DEMO_RESULTS["buildings"]["count"],
            "total_area_sqm": DEMO_RESULTS["buildings"]["total_area_sqm"],
        },
        "roads": {
            "total_length_m": DEMO_RESULTS["roads"]["total_length_m"],
            "segments": DEMO_RESULTS["roads"]["segments"],
        },
        "water_bodies": {
            "count": DEMO_RESULTS["water_bodies"]["count"],
            "total_area_sqm": DEMO_RESULTS["water_bodies"]["total_area_sqm"],
        },
        "vegetation": {
            "total_area_sqm": DEMO_RESULTS["vegetation"]["total_area_sqm"],
            "coverage_percent": DEMO_RESULTS["vegetation"]["coverage_percent"],
        },
    }
    return summary
