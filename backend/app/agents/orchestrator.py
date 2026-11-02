
"""Coordinate the five-agent SupplyGuard AI workflow."""

from app.agents.disruption_agent import detect_disruptions
from app.agents.impact_agent import analyze_impact
from app.agents.logistics_agent import evaluate_logistics
from app.agents.recovery_agent import generate_recovery_plan
from app.agents.compliance_agent import validate_recovery_options


def run_recovery_workflow(scenario: dict) -> dict:

    # Agent 1: Detect disruptions
    disruption_result = detect_disruptions(scenario)
    disruptions = disruption_result.get("disruptions", [])

    # Agent 2: Analyze business impact
    impact_result = analyze_impact(scenario, disruption_result)

    # Agent 3: Prepare logistics inputs
    logistics_scenario = dict(scenario)

    # Include materials detected as having low inventory
    detected_materials = {
        item["material_id"]
        for item in disruptions
        if item.get("type") == "low_inventory"
        and item.get("material_id")
    }

    existing_materials = set(
        scenario.get("needed_materials", [])
    )

    logistics_scenario["needed_materials"] = sorted(
        existing_materials | detected_materials
    )

    # Exclude disrupted suppliers from alternatives
    detected_suppliers = {
        item["supplier"]
        for item in disruptions
        if item.get("supplier")
    }

    logistics_scenario["disrupted_suppliers"] = sorted(
        set(scenario.get("disrupted_suppliers", []))
        | detected_suppliers
    )

    logistics_result = evaluate_logistics(logistics_scenario)

    # Agent 4: Generate recovery options
    recovery_result = generate_recovery_plan(
        logistics_result,
        required_units=scenario.get("required_units", 0),
        delay_cost_per_day=scenario.get("delay_cost_per_day", 1000),
    )

    # Agent 5: Validate supplier compliance
    compliance_result = validate_recovery_options(
        recovery_result,
        scenario,
    )

    recommendation = compliance_result.get("recommendation")

    status = (
        "recommendation_ready"
        if recommendation is not None
        else "manual_review_required"
    )

    return {
        "status": status,
        "industry": scenario.get("industry", "unknown"),
        "data_source": scenario.get("data_source", "provided scenario"),
        "overall_risk": disruption_result["overall_risk"],
        "disruptions": disruption_result,
        "impact_analysis": impact_result,
        "logistics": logistics_result,
        "recovery_plan": recovery_result,
        "compliance": compliance_result,
        "recommendation": recommendation,
        "requires_human_approval": True,
        "recovery_executed": False,
    }
