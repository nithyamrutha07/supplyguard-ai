
"""Coordinate the SupplyGuard AI disruption-to-recovery workflow."""

from copy import deepcopy

from app.agents.disruption_agent import detect_disruptions
from app.agents.impact_agent import analyze_impact
from app.agents.logistics_agent import evaluate_logistics
from app.agents.recovery_agent import generate_recovery_plan

from app.services.logistics_service import evaluate_alternatives
from app.services.production_service import assess_production_impact
from app.services.finance_service import calculate_financial_impact
from app.services.risk_service import calculate_risk
from app.services.compliance_service import check_compliance


def run_recovery_workflow(scenario: dict) -> dict:
    """Run the agents and services and return a consolidated assessment."""

    # 1. Detect supply chain disruptions.
    disruption_result = detect_disruptions(scenario)
    disruptions = disruption_result.get("disruptions", [])

    # 2. Analyze business impact.
    impact_result = analyze_impact(scenario, disruption_result)

    # Prepare logistics inputs using detected disruptions.
    logistics_scenario = deepcopy(scenario)

    detected_materials = {
        item["material_id"]
        for item in disruptions
        if item.get("type") == "low_inventory"
        and item.get("material_id")
    }

    logistics_scenario["needed_materials"] = sorted(
        set(scenario.get("needed_materials", []))
        | detected_materials
    )

    detected_suppliers = {
        item["supplier"]
        for item in disruptions
        if item.get("supplier")
    }

    logistics_scenario["disrupted_suppliers"] = sorted(
        set(scenario.get("disrupted_suppliers", []))
        | detected_suppliers
    )

    # 3. Run logistics agent for recovery planning.
    logistics_result = evaluate_logistics(logistics_scenario)

    # Run logistics service for an additional supplier assessment.
    logistics_service_result = evaluate_alternatives(
        logistics_scenario
    )

    # 4. Generate recovery options.
    recovery_result = generate_recovery_plan(
        logistics_result,
        required_units=scenario.get("required_units", 0),
        delay_cost_per_day=scenario.get("delay_cost_per_day", 0),
    )

    # 5. Validate recovery options.
    compliance_result = check_compliance(
        recovery_result,
        scenario,
    )

    recommendation = compliance_result.get("recommendation")

    status = (
        "recommendation_ready"
        if recommendation is not None
        else "manual_review_required"
    )

    # 6. Run additional business assessment services.
    risk_result = calculate_risk(disruption_result)

    production_scenario = deepcopy(scenario)
    production_scenario["detected_disruptions"] = disruptions

    production_result = assess_production_impact(
        production_scenario
    )

    financial_result = calculate_financial_impact(
        scenario,
        recovery_result,
    )

    # 7. Report limitations from the current database schema.
    data_gaps = [
        "Supplier-to-material mappings are not available.",
        "Alternative supplier stock and lead times are not available.",
        "Supplier approval records are not available.",
        "Customer orders and factory dependencies are not available.",
        "Daily inventory demand is not available.",
    ]

    return {
        "status": status,
        "industry": scenario.get("industry", "unknown"),
        "data_source": scenario.get(
            "data_source",
            "provided scenario"
        ),

        "overall_risk": disruption_result.get(
            "overall_risk",
            "unknown"
        ),

        "risk_assessment": risk_result,
        "disruptions": disruption_result,
        "impact_analysis": impact_result,

        "logistics": logistics_result,
        "logistics_service_assessment": logistics_service_result,

        "production_assessment": production_result,
        "recovery_plan": recovery_result,
        "financial_impact": financial_result,
        "compliance": compliance_result,

        "recommendation": recommendation,
        "data_gaps": data_gaps,

        "requires_human_approval": True,
        "recovery_executed": False,
    }
