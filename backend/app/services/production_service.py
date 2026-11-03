# Production and demand calculations.

"""Production impact assessment using available inventory data."""


def assess_production_impact(scenario: dict) -> dict:
    inventory = scenario.get("inventory", [])
    disruptions = scenario.get("detected_disruptions", [])

    affected_materials = {
        str(item.get("material_id", "")).strip().casefold()
        for item in disruptions
        if item.get("type") == "low_inventory"
        and item.get("material_id")
    }

    affected_inventory = [
        {
            "material": item.get("material_id"),
            "available_units": item.get("available_units")
        }
        for item in inventory
        if str(item.get("material_id", "")).strip().casefold()
        in affected_materials
    ]

    return {
        "status": (
            "potential_production_impact"
            if affected_inventory
            else "insufficient_production_data"
        ),
        "affected_material_count": len(affected_inventory),
        "affected_materials": affected_inventory,
        "production_capacity": None,
        "daily_demand": None,
        "estimated_production_delay_days": None,
        "data_limitations": [
            "Production capacity is not available in the current HANA schema.",
            "Daily material demand is not available.",
            "Factory dependencies and customer orders are not available."
        ],
        "requires_human_review": True
    }
