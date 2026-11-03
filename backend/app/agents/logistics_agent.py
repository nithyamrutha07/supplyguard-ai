"""Evaluate alternative suppliers using verified scenario data."""


def evaluate_logistics(scenario: dict) -> dict:
    alternatives = []
    rejected = []

    disrupted_suppliers = {
        str(name).strip().casefold()
        for name in scenario.get("disrupted_suppliers", [])
    }

    needed_materials = {
        str(name).strip().casefold()
        for name in scenario.get("needed_materials", [])
    }

    for supplier in scenario.get("alternative_suppliers", []):
        supplier_name = str(
            supplier.get("supplier", "unknown")
        ).strip()

        if supplier_name.casefold() in disrupted_suppliers:
            rejected.append({
                "supplier": supplier_name,
                "reason": "Supplier is currently disrupted.",
            })
            continue

        materials = {
            str(material).strip().casefold()
            for material in supplier.get("materials", [])
        }

        matching_materials = materials & needed_materials

        if not matching_materials:
            rejected.append({
                "supplier": supplier_name,
                "reason": "No matching required material.",
            })
            continue

        available = supplier.get("available_units")
        cost = supplier.get("cost_per_unit")
        lead_time = supplier.get("lead_time_days")

        if any(value is None for value in (available, cost, lead_time)):
            rejected.append({
                "supplier": supplier_name,
                "reason": "Stock, cost or lead-time information is missing.",
            })
            continue

        if available <= 0 or cost < 0 or lead_time < 0:
            rejected.append({
                "supplier": supplier_name,
                "reason": "Invalid stock, cost or lead-time information.",
            })
            continue

        alternatives.append({
            "supplier": supplier_name,
            "materials": sorted(matching_materials),
            "available_units": available,
            "cost_per_unit": cost,
            "lead_time_days": lead_time,
            "estimated_cost": round(available * cost, 2),
            "status": "candidate",
        })

    alternatives.sort(
        key=lambda item: (
            item["lead_time_days"],
            item["cost_per_unit"],
        )
    )

    return {
        "alternative_count": len(alternatives),
        "alternatives": alternatives,
        "rejected_count": len(rejected),
        "rejected_alternatives": rejected,
        "data_source": "verified scenario supplier records",
    }