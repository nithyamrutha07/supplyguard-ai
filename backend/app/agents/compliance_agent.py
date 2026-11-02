# Validate industry-specific rules and constraints.

"""Validate recovery options against industry-specific rules."""


def validate_recovery_options(
    recovery_result: dict,
    scenario: dict,
) -> dict:
    """Filter recovery options using configured supplier approval rules."""

    industry = scenario.get("industry", "manufacturing").lower()

    approved_suppliers = set(
        scenario.get("approved_suppliers", [])
    )
    prohibited_suppliers = set(
        scenario.get("prohibited_suppliers", [])
    )

    valid_options = []
    rejected_options = []

    for option in recovery_result.get("options", []):
        supplier = option.get("supplier", "unknown")
        reasons = []

        if supplier in prohibited_suppliers:
            reasons.append("Supplier is explicitly prohibited.")

        if industry == "pharmaceuticals" and supplier not in approved_suppliers:
            reasons.append(
                "Pharmaceutical supplier is not on the approved supplier list."
            )

        if reasons:
            rejected_options.append({
                "supplier": supplier,
                "reasons": reasons,
            })
        else:
            valid_options.append(option)

    valid_options.sort(
        key=lambda option: (
            option.get("estimated_total_cost", float("inf")),
            option.get("lead_time_days", float("inf")),
        )
    )

    if valid_options:
        recommendation = valid_options[0]
        status = "compliant_options_available"
    else:
        recommendation = None
        status = "no_compliant_options"

    return {
        "industry": industry,
        "status": status,
        "compliant_option_count": len(valid_options),
        "compliant_options": valid_options,
        "rejected_options": rejected_options,
        "recommendation": recommendation,
        "requires_human_approval": True,
    }
