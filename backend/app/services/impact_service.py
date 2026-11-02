
from app.database.repositories import (
    get_suppliers,
    get_inventory,
    get_shipments,
    get_disruptions
)


def analyze_impact(incident_id: int):
    disruptions = get_disruptions()

    incident = next(
        (d for d in disruptions if d["INCIDENT_ID"] == incident_id),
        None
    )

    if incident is None:
        return None

    shipments = get_shipments()
    inventory = get_inventory()
    suppliers = get_suppliers()

    affected_shipments = []

    if incident["INCIDENT_TYPE"] == "SUPPLIER_DELAY":
        description = incident["DESCRIPTION"].lower()

        for shipment in shipments:
            supplier = next(
                (s for s in suppliers
                 if s["SUPPLIER_ID"] == shipment["SUPPLIER_ID"]),
                None
            )

            if supplier and supplier["SUPPLIER_NAME"].lower() in description:
                affected_shipments.append(shipment)

    delayed_count = sum(
        1 for shipment in affected_shipments
        if shipment["STATUS"] == "DELAYED"
    )

    return {
        "incident_id": incident_id,
        "incident_type": incident["INCIDENT_TYPE"],
        "severity": incident["SEVERITY"],
        "estimated_loss": float(incident["ESTIMATED_LOSS"]),
        "affected_shipments": affected_shipments,
        "affected_shipment_count": len(affected_shipments),
        "delayed_shipment_count": delayed_count,
        "total_inventory_records": len(inventory),
        "total_suppliers": len(suppliers)
    }
