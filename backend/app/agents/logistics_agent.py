# Evaluate alternative suppliers, stock and transport routes.

"""Evaluate alternative suppliers and available inventory."""


def evaluate_logistics(scenario: dict) -> dict:
    alternatives = []
    rejected = []

    disrupted_suppliers = set(scenario.get("disrupted_suppliers", []))
    needed_materials = set(scenario.get("needed_materials", []))

    for supplier in scenario.get("alternative_suppliers", []):
        supplier_name = supplier.get("supplier", "unknown")
        materials = set(supplier.get("materials", []))
        available = supplier.get("available_units", 0)
        cost_per_unit = supplier.get("cost_per_unit", 0)
        lead_time = supplier.get("lead_time_days", 0)

        if supplier_name in disrupted_suppliers:
            rejected.append({
                "supplier": supplier_name,
                "reason": "Supplier is marked as disrupted.",
            })
            continue

        matching_materials = materials & needed_materials

        if not matching_materials:
            rejected.append({
                "supplier": supplier_name,
                "reason": "Supplier does not provide a needed material.",
            })
            continue

        if available <= 0:
            rejected.append({
                "supplier": supplier_name,
                "reason": "No available stock.",
            })
            continue

        alternatives.append({
            "supplier": supplier_name,
            "materials": sorted(matching_materials),
            "available_units": available,
            "cost_per_unit": cost_per_unit,
            "lead_time_days": lead_time,
            "estimated_cost": round(available * cost_per_unit, 2),
            "status": "candidate",
        })

    alternatives.sort(
        key=lambda option: (
            option["lead_time_days"],
            option["cost_per_unit"],
        )
    )

    return {
        "alternative_count": len(alternatives),
        "alternatives": alternatives,
        "rejected_count": len(rejected),
        "rejected_alternatives": rejected,
    }
