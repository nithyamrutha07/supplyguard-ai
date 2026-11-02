
from fastapi import APIRouter, HTTPException
from app.services.impact_service import analyze_impact

router = APIRouter(prefix="/api/impact", tags=["Impact Analysis"])


@router.get("/analyze/{incident_id}")
def get_impact_analysis(incident_id: int):
    result = analyze_impact(incident_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Disruption not found"
        )

    return {
        "success": True,
        "data": result
    }
