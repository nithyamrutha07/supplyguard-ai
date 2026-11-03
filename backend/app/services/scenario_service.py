
from datetime import date, datetime

from app.database.repositories import (
    get_disruptions,
    get_shipments,
    get_suppliers,
    get_inventory,
)


def _to_date(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return date.fromisoformat(value[:10])
    return None


def build_hana_scenario(incident_id: int) -> dict | None:
    disruptions = get_disruptions()

    incident = next(
        (
            item for item in disruptions
            if int(item["INCIDENT_ID"]) == incident_id
        ),
        None,
    )

    if incident is None:
        return None

    suppliers = get_suppliers()
    shipments = get_shipments()
    inventory = get_inventory()

    description = str(incident.get("DESCRIPTION", "")).lower()

    supplier_lookup = {
        supplier["SUPPLIER_ID"]: supplier["SUPPLIER_NAME"]
        for supplier in suppliers
    }

    disrupted_suppliers = [
        name for name in supplier_lookup.values()
        if name.lower() in description
    ]

    shipment_records = []

    for shipment in shipments:
        supplier_name = supplier_lookup.get(
            shipment["SUPPLIER_ID"], "Unknown supplier"
        )

        expected = _to_date(shipment.get("EXPECTED_DATE"))
        actual = _to_date(shipment.get("ACTUAL_DATE"))
        status = str(shipment.get("STATUS", "unknown")).upper()

        delay_days = 0
        delay_is_estimated = False

        if expected and actual:
            delay_days = max(0, (actual - expected).days)
        elif expected and status == "DELAYED" and expected < date.today():
            delay_days = (date.today() - expected).days
            delay_is_estimated = True

        shipment_records.append({
            "shipment_id": shipment["SHIPMENT_ID"],
            "supplier": supplier_name,
            "status": status.lower(),
            "delay_days": delay_days,
            "delay_is_estimated": delay_is_estimated,
        })

    inventory_records = [
        {
            "material_id": item["MATERIAL_NAME"],
            "available_units": item["AVAILABLE_QUANTITY"],
        }
        for item in inventory
    ]

    needed_materials = [
        item["MATERIAL_NAME"]
        for item in inventory
        if str(item["MATERIAL_NAME"]).lower() in description
    ]

    return {
        "incident": {
            "incident_id": incident["INCIDENT_ID"],
            "incident_type": incident["INCIDENT_TYPE"],
            "description": incident["DESCRIPTION"],
            "severity": incident["SEVERITY"],
            "estimated_loss": float(incident["ESTIMATED_LOSS"]),
            "status": incident["STATUS"],
        },
        "industry": "unknown",
        "shipments": shipment_records,
        "inventory": inventory_records,
        "disrupted_suppliers": disrupted_suppliers,
        "needed_materials": needed_materials,
        "alternative_suppliers": [],
        "approved_suppliers": [],
        "prohibited_suppliers": [],
        "required_units": 0,
        "delay_cost_per_day": 0,
        "data_source": "SAP HANA Cloud",
    }
