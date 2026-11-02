# Disruption API routes.
from fastapi import APIRouter, HTTPException
from app.database.repositories import get_disruptions

router = APIRouter(prefix="/api", tags=["Disruptions"])


@router.get("/disruptions")
def read_disruptions():
    try:
        data = get_disruptions()
        return {
            "success": True,
            "count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch disruptions: {str(e)}"
        )