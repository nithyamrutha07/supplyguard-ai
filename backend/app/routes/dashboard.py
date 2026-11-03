
from fastapi import APIRouter
from app.database.repositories import fetch_dashboard_data

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard")
def dashboard():
    data = fetch_dashboard_data()

    shipments = data["shipments"]
    disruptions = data["disruptions"]

    return {
        "total_suppliers": len(data["suppliers"]),
        "total_inventory_items": len(data["inventory"]),
        "total_shipments": len(shipments),
        "delayed_shipments": sum(
            1 for s in shipments if s["STATUS"] == "DELAYED"
        ),
        "open_disruptions": sum(
            1 for d in disruptions if d["STATUS"] == "OPEN"
        ),
        "recovery_plans": len(data["recovery_plans"])
    }
