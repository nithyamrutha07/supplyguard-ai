# Shipment API routes.
from fastapi import APIRouter, HTTPException
from app.database.repositories import get_shipments

router = APIRouter(prefix="/api", tags=["Shipments"])


@router.get("/shipments")
def read_shipments():
    try:
        data = get_shipments()
        return {
            "success": True,
            "count": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch shipments: {str(e)}"
        )