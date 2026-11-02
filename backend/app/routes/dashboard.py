# Dashboard API routes.
from fastapi import APIRouter
from app.database.repositories import (
    get_suppliers,
    get_inventory,
    get_shipments,
    get_disruptions,
    get_recovery_plans
)

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard")
def dashboard():
    suppliers = get_suppliers()
    inventory = get_inventory()
    shipments = get_shipments()
    disruptions = get_disruptions()
    recovery = get_recovery_plans()

    return {
        "total_suppliers": len(suppliers),
        "total_inventory_items": len(inventory),
        "total_shipments": len(shipments),
        "delayed_shipments": sum(
            1 for s in shipments if s["STATUS"] == "DELAYED"
        ),
        "open_disruptions": sum(
            1 for d in disruptions if d["STATUS"] == "OPEN"
        ),
        "recovery_plans": len(recovery)
    }