# Financial impact, recovery cost and ROI calculations.

"""Financial impact and recovery cost calculations."""


def calculate_financial_impact(
    scenario: dict,
    recovery_result: dict | None = None,
    recorded_plans: list | None = None
) -> dict:
    incident = scenario.get("incident", {})
    estimated_loss = incident.get("estimated_loss")

    try:
        estimated_loss = (
            float(estimated_loss)
            if estimated_loss is not None
            else None
        )
    except (TypeError, ValueError):
        estimated_loss = None

    options = (
        recovery_result.get("options", [])
        if recovery_result
        else []
    )

    recovery_costs = []

    for option in options:
        cost = option.get("estimated_total_cost")

        if cost is None:
            cost = option.get("estimated_cost")

        try:
            cost = float(cost)
        except (TypeError, ValueError):
            continue

        recovery_costs.append({
            "supplier": option.get("supplier", "Unknown"),
            "estimated_recovery_cost": round(cost, 2)
        })

    plans = recorded_plans or []
    historical_plan_summary = []

    for plan in plans:
        historical_plan_summary.append({
            "plan_id": plan.get("PLAN_ID"),
            "recovery_cost": plan.get("RECOVERY_COST"),
            "avoided_loss": plan.get("AVOIDED_LOSS"),
            "status": plan.get("PLAN_STATUS")
        })

    return {
        "estimated_incident_loss": estimated_loss,
        "currency": "INR",
        "recovery_cost_options": recovery_costs,
        "historical_recovery_plans": historical_plan_summary,
        "roi_status": "not_calculated",
        "estimated_roi": None,
        "financial_note": (
            "ROI is not calculated because verified avoided-loss "
            "values for the proposed recovery options are unavailable."
        ),
        "data_source": "SAP HANA Cloud and workflow scenario"
    }
