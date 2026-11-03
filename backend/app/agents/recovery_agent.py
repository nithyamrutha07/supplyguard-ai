"""Generate recovery recommendations only from verified logistics data."""


def generate_recovery_plan(
    logistics_result: dict,
    required_units: int = 0,
    delay_cost_per_day: float = 0,
) -> dict:

    alternatives = logistics_result.get("alternatives", [])

    # No verified alternatives means manual review is required.
    if not alternatives:
        return {
            "status": "manual_review_required",
            "message": (
                "No verified alternative supplier data is available. "
                "Supplier stock, material costs and lead times must "
                "be confirmed before recommending recovery."
            ),
            "recommendation": None,
            "options": [],
            "requires_human_approval": True,
        }

    if required_units <= 0:
        return {
            "status": "manual_review_required",
            "message": "Required quantity has not been verified.",
            "recommendation": None,
            "options": [],
            "requires_human_approval": True,
        }

    options = []

    for supplier in alternatives:
        available = supplier.get("available_units")
        unit_cost = supplier.get("cost_per_unit")
        lead_time = supplier.get("lead_time_days")

        # Reject incomplete or unverified cost and stock information.
        if any(value is None for value in (available, unit_cost, lead_time)):
            continue

        if available < required_units or unit_cost < 0 or lead_time < 0:
            continue

        material_cost = required_units * unit_cost
        delay_cost = lead_time * delay_cost_per_day

        options.append({
            "supplier": supplier["supplier"],
            "required_units": required_units,
            "material_cost": round(material_cost, 2),
            "lead_time_days": lead_time,
            "estimated_delay_cost": round(delay_cost, 2),
            "estimated_total_cost": round(
                material_cost + delay_cost, 2
            ),
        })

    options.sort(
        key=lambda item: item["estimated_total_cost"]
    )

    if not options:
        return {
            "status": "no_feasible_option",
            "message": "No verified supplier can meet the required quantity.",
            "recommendation": None,
            "options": [],
            "requires_human_approval": True,
        }

    return {
        "status": "recommendation_ready",
        "message": "Recovery options ranked by estimated total cost.",
        "recommendation": options[0],
        "options": options,
        "requires_human_approval": True,
    }