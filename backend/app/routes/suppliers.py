# Supplier API routes.

from fastapi import APIRouter, HTTPException
from app.database.repositories import get_suppliers

router = APIRouter(
    prefix="/api/suppliers",
    tags=["Suppliers"]
)

@router.get("/")
def read_suppliers():
    try:
        suppliers = get_suppliers()
        return {
            "success": True,
            "count": len(suppliers),
            "data": suppliers
        }
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch suppliers from SAP HANA"
        )
