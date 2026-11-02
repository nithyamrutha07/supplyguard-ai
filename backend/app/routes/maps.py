# Map marker, route and dependency graph APIs.
from fastapi import APIRouter
from app.database.repositories import (
    get_suppliers,
    get_warehouses,
    get_shipments
)

router = APIRouter(prefix="/api/maps", tags=["Maps"])


@router.get("/nodes")
def get_map_nodes():
    suppliers = get_suppliers()
    warehouses = get_warehouses()

    nodes = []

    for supplier in suppliers:
        nodes.append({
            "id": f"supplier-{supplier['SUPPLIER_ID']}",
            "name": supplier["SUPPLIER_NAME"],
            "type": "supplier",
            "location": supplier["LOCATION"]
        })

    for warehouse in warehouses:
        nodes.append({
            "id": f"warehouse-{warehouse['WAREHOUSE_ID']}",
            "name": warehouse["WAREHOUSE_NAME"],
            "type": "warehouse"
        })

    return {"count": len(nodes), "data": nodes}


@router.get("/shipments")
def get_map_shipments():
    return {
        "count": len(get_shipments()),
        "data": get_shipments()
    }