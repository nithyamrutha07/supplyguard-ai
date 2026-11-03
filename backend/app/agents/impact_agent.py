"""Analyze supply-chain impact using actual SAP HANA records."""


def analyze_impact(
    scenario: dict,
    disruption_result: dict,
) -> dict:

    incident = scenario.get("incident", {})
    incident_type = str(
        incident.get("incident_type", "")
    ).upper()

    disrupted_suppliers = {
        name.lower()
        for name in scenario.get("disrupted_suppliers", [])
    }

    affected_shipments = []

    # Identify shipments belonging to the disrupted supplier.
    for shipment in scenario.get("shipments", []):
        supplier = str(
            shipment.get("supplier", "")
        ).lower()

        if supplier in disrupted_suppliers:
            affected_shipments.append({
                "shipment_id": shipment.get("shipment_id"),
                "supplier": shipment.get("supplier"),
                "status": shipment.get("status"),
                "delay_days": shipment.get("delay_days", 0),
                "reason": "Shipment belongs to the disrupted supplier.",
            })

    # Identify inventory records matching the incident description.
    description = str(
        incident.get("description", "")
    ).lower()

    affected_inventory = []

    for item in scenario.get("inventory", []):
        material = str(item.get("material_id", ""))

        if material.lower() in description:
            affected_inventory.append({
                "material": material,
                "available_units": item.get("available_units"),
            })

    delayed_count = sum(
        1
        for shipment in affected_shipments
        if shipment.get("status") == "delayed"
    )

    return {
        "incident_id": incident.get("incident_id"),
        "incident_type": incident_type,
        "affected_supplier_count": len(disrupted_suppliers),
        "affected_suppliers": sorted(disrupted_suppliers),
        "affected_shipment_count": len(affected_shipments),
        "delayed_shipment_count": delayed_count,
        "affected_shipments": affected_shipments,
        "affected_inventory": affected_inventory,
        "affected_factory_count": 0,
        "affected_order_count": 0,
        "impact_data_note": (
            "Factory dependencies and customer orders are not "
            "stored in the current database schema."
        ),
        "estimated_loss": incident.get("estimated_loss", 0),
        "currency": "INR",
    }