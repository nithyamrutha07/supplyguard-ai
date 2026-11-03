"""Validate recovery recommendations against supplier compliance rules."""


def validate_recovery_options(
    recovery_result: dict,
    scenario: dict,
) -> dict:

    industry = str(
        scenario.get("industry", "unknown")
    ).lower()

    approved_suppliers = {
        name.lower()
        for name in scenario.get("approved_suppliers", [])
    }

    prohibited_suppliers = {
        name.lower()
        for name in scenario.get("prohibited_suppliers", [])
    }

    valid_options = []
    rejected_options = []

    for option in recovery_result.get("options", []):
        supplier = option.get("supplier", "unknown")
        supplier_key = supplier.lower()
        reasons = []

        if supplier_key in prohibited_suppliers:
            reasons.append("Supplier is explicitly prohibited.")

        if industry in {"pharmaceutical", "pharmaceuticals"}:
            if not approved_suppliers:
                reasons.append(
                    "Approved supplier records are unavailable."
                )
            elif supplier_key not in approved_suppliers:
                reasons.append(
                    "Supplier is not on the approved supplier list."
                )

        if reasons:
            rejected_options.append({
                "supplier": supplier,
                "reasons": reasons,
            })
        else:
            valid_options.append(option)

    valid_options.sort(
        key=lambda item: item.get(
            "estimated_total_cost", float("inf")
        )
    )

    recommendation = valid_options[0] if valid_options else None

    if recommendation:
        status = "compliant_options_available"
    elif rejected_options:
        status = "no_compliant_options"
    else:
        status = "manual_review_required"

    return {
        "industry": industry,
        "status": status,
        "compliant_option_count": len(valid_options),
        "compliant_options": valid_options,
        "rejected_options": rejected_options,
        "recommendation": recommendation,
        "requires_human_approval": True,
    }