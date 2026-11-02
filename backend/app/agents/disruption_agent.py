# Detect supplier, shipment and inventory disruptions.

"""Detect shipment, supplier, and inventory disruptions."""

from typing import Any


def detect_disruptions(scenario: dict[str, Any]) -> dict[str, Any]:
    """
    Inspect shipment and inventory data.

    Expected input:
    {
        "shipments": [
            {
                "shipment_id": "SHP-101",
                "supplier": "Supplier A",
                "delay_days": 2,
                "status": "delayed"
            }
        ],
        "inventory": [
            {
                "material_id": "MAT-101",
                "available_units": 20,
                "daily_demand": 15
            }
        ]
    }
    """
    disruptions = []

    # 1. Detect shipment delays and supplier failures.
    for shipment in scenario.get("shipments", []):
        delay_days = max(0, shipment.get("delay_days", 0))
        status = str(shipment.get("status", "")).lower()

        if status in {"failed", "cancelled", "supplier_failure"}:
            disruptions.append({
                "type": "supplier_failure",
                "shipment_id": shipment.get("shipment_id", "unknown"),
                "supplier": shipment.get("supplier", "unknown"),
                "severity": "critical",
                "message": "Shipment or supplier failure detected.",
            })

        elif status == "delayed" or delay_days > 0:
            severity = (
                "critical" if delay_days >= 3
                else "high" if delay_days >= 2
                else "medium"
            )

            disruptions.append({
                "type": "shipment_delay",
                "shipment_id": shipment.get("shipment_id", "unknown"),
                "supplier": shipment.get("supplier", "unknown"),
                "delay_days": delay_days,
                "severity": severity,
                "message": f"Shipment delayed by {delay_days} day(s).",
            })

    # 2. Detect inventory shortages.
    for item in scenario.get("inventory", []):
        available = max(0, item.get("available_units", 0))
        demand = max(0, item.get("daily_demand", 0))

        # Avoid division by zero when demand is zero.
        days_remaining = available / demand if demand > 0 else None

        if demand > 0 and days_remaining < 2:
            severity = "critical" if days_remaining < 1 else "high"

            disruptions.append({
                "type": "low_inventory",
                "material_id": item.get("material_id", "unknown"),
                "available_units": available,
                "daily_demand": demand,
                "days_remaining": round(days_remaining, 2),
                "severity": severity,
                "message": "Inventory may run out within two days.",
            })

    # 3. Summarise the overall risk.
    if any(d["severity"] == "critical" for d in disruptions):
        overall_risk = "critical"
    elif any(d["severity"] == "high" for d in disruptions):
        overall_risk = "high"
    elif disruptions:
        overall_risk = "medium"
    else:
        overall_risk = "low"

    return {
        "overall_risk": overall_risk,
        "disruption_count": len(disruptions),
        "disruptions": disruptions,
    }
