# Coordinate agent workflow here.

"""Coordinate SupplyGuard AI's disruption-to-recovery workflow."""

from copy import deepcopy

from app.agents.disruption_agent import detect_disruptions
from app.agents.impact_agent import analyze_impact
from app.agents.logistics_agent import evaluate_logistics
from app.agents.recovery_agent import generate_recovery_plan
from app.agents.compliance_agent import validate_recovery_options


def run_recovery_workflow(scenario: dict) -> dict:
    """Run all agents and return one consolidated recovery assessment."""

    if not isinstance(scenario, dict):
        raise ValueError("scenario must be a dictionary.")

    required_units = scenario.get("required_units", 0)
    delay_cost_per_day = scenario.get("delay_cost_per_day", 1000)

    if (
        not isinstance(required_units, (int, float))
        or isinstance(required_units, bool)
        or required_units <= 0
    ):
        raise ValueError("required_units must be a positive number.")

    if (
        not isinstance(delay_cost_per_day, (int, float))
        or isinstance(delay_cost_per_day, bool)
        or delay_cost_per_day < 0
    ):
        raise ValueError("delay_cost_per_day must be a non-negative number.")

    # Step 1: Detect disruptions.
    disruption_result = detect_disruptions(scenario)

    # Step 2: Trace affected factories and customer orders.
    impact_result = analyze_impact(scenario, disruption_result)

    # Step 3: Prepare logistics inputs from the detected disruptions.
    logistics_scenario = deepcopy(scenario)

    detected_materials = {
        item["material_id"]
        for item in disruption_result["disruptions"]
        if item["type"] == "low_inventory"
    }

    needed_materials = set(
        logistics_scenario.get("needed_materials", [])
    )
    logistics_scenario["needed_materials"] = sorted(
        needed_materials | detected_materials
    )

    detected_failed_suppliers = {
        item["supplier"]
        for item in disruption_result["disruptions"]
        if item["type"] == "supplier_failure"
    }

    disrupted_suppliers = set(
        logistics_scenario.get("disrupted_suppliers", [])
    )
    logistics_scenario["disrupted_suppliers"] = sorted(
        disrupted_suppliers | detected_failed_suppliers
    )

    logistics_result = evaluate_logistics(logistics_scenario)

    # Step 4: Compare recovery options.
    required_units = scenario.get("required_units", 0)
    delay_cost_per_day = scenario.get("delay_cost_per_day", 1000)

    recovery_result = generate_recovery_plan(
        logistics_result,
        required_units=required_units,
        delay_cost_per_day=delay_cost_per_day,
    )

    # Step 5: Apply industry-specific compliance rules.
    compliance_result = validate_recovery_options(
        recovery_result,
        scenario,
    )

    # Step 6: Consolidate the recommendation.
    recommendation = compliance_result["recommendation"]

    if recommendation is not None:
        status = "recommendation_ready"
    else:
        status = "manual_review_required"

    return {
        "status": status,
        "industry": scenario.get("industry", "manufacturing"),
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
