"""Detect disruptions using SAP HANA incident and shipment records."""


def detect_disruptions(scenario: dict) -> dict:
    disruptions = []
    incident = scenario.get("incident", {})

    incident_type = str(
        incident.get("incident_type", "")
    ).upper()

    incident_severity = str(
        incident.get("severity", "medium")
    ).lower()

    # 1. Detect the actual HANA incident.
    if incident:
        disruptions.append({
            "type": incident_type.lower(),
            "incident_id": incident.get("incident_id"),
            "severity": incident_severity,
            "description": incident.get("description", ""),
            "estimated_loss": incident.get("estimated_loss", 0),
            "message": (
                f"{incident_type.replace('_', ' ').title()} detected: "
                f"{incident.get('description', '')}"
            ),
        })

    # 2. Detect delayed or failed shipments.
    for shipment in scenario.get("shipments", []):
        status = str(shipment.get("status", "")).lower()
        delay_days = max(0, shipment.get("delay_days", 0))

        supplier = shipment.get("supplier", "Unknown")
        shipment_id = shipment.get("shipment_id")

        if status in {"failed", "cancelled", "supplier_failure"}:
            disruptions.append({
                "type": "supplier_failure",
                "shipment_id": shipment_id,
                "supplier": supplier,
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
                "shipment_id": shipment_id,
                "supplier": supplier,
                "delay_days": delay_days,
                "severity": severity,
                "message": f"Shipment delayed by {delay_days} day(s).",
            })

    # 3. Detect inventory shortages only when actual demand is available.
    for item in scenario.get("inventory", []):
        available = max(0, item.get("available_units", 0))
        demand = max(0, item.get("daily_demand", 0))

        if demand > 0:
            days_remaining = available / demand

            if days_remaining < 2:
                severity = (
                    "critical" if days_remaining < 1 else "high"
                )

                disruptions.append({
                    "type": "low_inventory",
                    "material_id": item.get("material_id"),
                    "available_units": available,
                    "daily_demand": demand,
                    "days_remaining": round(days_remaining, 2),
                    "severity": severity,
                    "message": "Inventory may run out within two days.",
                })

    # 4. Determine overall risk.
    severity_order = {
        "critical": 3,
        "high": 2,
        "medium": 1,
        "low": 0,
    }

    overall_risk = max(
        (
            item["severity"]
            for item in disruptions
        ),
        key=lambda severity: severity_order.get(severity, 0),
        default="low",
    )

    return {
        "overall_risk": overall_risk,
        "disruption_count": len(disruptions),
        "disruptions": disruptions,
    }