# Generate and compare recovery options.

"""Compare recovery options and recommend a practical response."""


def generate_recovery_plan(
    logistics_result: dict,
    required_units: int,
    delay_cost_per_day: float = 1000,
) -> dict:
    """Rank feasible suppliers by estimated total business cost."""

    if required_units <= 0:
        return {
            "status": "invalid_input",
            "message": "required_units must be greater than zero.",
            "recommendation": None,
            "options": [],
        }

    options = []

    for supplier in logistics_result.get("alternatives", []):
        available = supplier.get("available_units", 0)
        unit_cost = supplier.get("cost_per_unit", 0)
        lead_time = supplier.get("lead_time_days", 0)

        if available < required_units:
            continue

        if unit_cost < 0 or lead_time < 0:
            continue

        material_cost = required_units * unit_cost
        delay_cost = lead_time * delay_cost_per_day
        total_cost = material_cost + delay_cost

        options.append({
            "supplier": supplier["supplier"],
            "required_units": required_units,
            "material_cost": round(material_cost, 2),
            "lead_time_days": lead_time,
            "estimated_delay_cost": round(delay_cost, 2),
            "estimated_total_cost": round(total_cost, 2),
        })

    options.sort(
        key=lambda option: (
            option["estimated_total_cost"],
            option["lead_time_days"],
        )
    )

    if not options:
        return {
            "status": "no_feasible_option",
            "message": (
                "No alternative supplier has enough stock "
                "to cover the required quantity."
            ),
            "recommendation": None,
            "options": [],
        }

    return {
        "status": "recommendation_ready",
        "recommendation": options[0],
        "options": options,
        "requires_human_approval": True,
        "message": (
            "Recommendation is based on estimated material and delay costs. "
            "Human approval is required before simulated recovery."
        ),
    }
