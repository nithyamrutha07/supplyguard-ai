# Inventory API routes.

from fastapi import APIRouter, HTTPException
from app.database.repositories import get_inventory

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)

@router.get("/")
def read_inventory():
    try:
        records = get_inventory()
        return {
            "success": True,
            "count": len(records),
            "data": records
        }
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch inventory from SAP HANA"
        )
