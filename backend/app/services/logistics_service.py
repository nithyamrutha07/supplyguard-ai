# Route and logistics calculations.

"""Logistics service for evaluating verified alternative suppliers."""


def evaluate_alternatives(scenario: dict) -> dict:
    disrupted = {
        str(name).strip().casefold()
        for name in scenario.get("disrupted_suppliers", [])
    }

    required_materials = {
        str(name).strip().casefold()
        for name in scenario.get("needed_materials", [])
    }

    candidates = []
    rejected = []

    for supplier in scenario.get("alternative_suppliers", []):
        name = str(supplier.get("supplier", "Unknown")).strip()

        if name.casefold() in disrupted:
            rejected.append({
                "supplier": name,
                "reason": "Supplier is currently disrupted."
            })
            continue

        materials = {
            str(item).strip().casefold()
            for item in supplier.get("materials", [])
        }
        matching = materials & required_materials

        if not matching:
            rejected.append({
                "supplier": name,
                "reason": "No matching required material."
            })
            continue

        available = supplier.get("available_units")
        cost = supplier.get("cost_per_unit")
        lead_time = supplier.get("lead_time_days")

        if any(value is None for value in (available, cost, lead_time)):
            rejected.append({
                "supplier": name,
                "reason": "Stock, cost or lead-time data is missing."
            })
            continue

        try:
            available = float(available)
            cost = float(cost)
            lead_time = float(lead_time)
        except (TypeError, ValueError):
            rejected.append({
                "supplier": name,
                "reason": "Supplier data contains invalid numbers."
            })
            continue

        if available <= 0 or cost < 0 or lead_time < 0:
            rejected.append({
                "supplier": name,
                "reason": "Supplier data contains invalid values."
            })
            continue

        candidates.append({
            "supplier": name,
            "materials": sorted(matching),
            "available_units": available,
            "cost_per_unit": cost,
            "lead_time_days": lead_time,
            "estimated_cost": round(available * cost, 2),
            "status": "candidate"
        })

    candidates.sort(
        key=lambda item: (
            item["lead_time_days"],
            item["cost_per_unit"]
        )
    )

    return {
        "alternative_count": len(candidates),
        "alternatives": candidates,
        "rejected_count": len(rejected),
        "rejected_alternatives": rejected,
        "data_source": "verified scenario supplier records"
    }
