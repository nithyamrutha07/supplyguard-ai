# Coordinate agent workflow here.

from app.database.repositories import (
    get_disruptions,
    get_suppliers,
    get_inventory,
    get_shipments,
    get_recovery_plans
)


def run_supply_chain_workflow(incident_id: int):
    # 1. Disruption detection
    disruptions = get_disruptions()

    incident = next(
        (item for item in disruptions
         if item["INCIDENT_ID"] == incident_id),
        None
    )

    if incident is None:
        return None

    # 2. Collect supply chain data
    suppliers = get_suppliers()
    inventory = get_inventory()
    shipments = get_shipments()
    plans = get_recovery_plans()

    # 3. Find related recovery plan
    recovery_plan = next(
        (plan for plan in plans
         if plan["INCIDENT_ID"] == incident_id),
        None
    )

    # 4. Prepare financial comparison
    financial_analysis = None

    if recovery_plan:
        recovery_cost = float(recovery_plan["RECOVERY_COST"])
        avoided_loss = float(recovery_plan["AVOIDED_LOSS"])

        financial_analysis = {
            "recovery_cost": recovery_cost,
            "avoided_loss": avoided_loss,
            "net_benefit": avoided_loss - recovery_cost
        }

    # 5. Prepare agent workflow result
    return {
        "success": True,
        "incident": incident,
        "workflow": [
            "Disruption Detection",
            "Impact Analysis",
            "Logistics Assessment",
            "Recovery Planning",
            "Financial Evaluation",
            "Compliance Review"
        ],
        "supply_chain_context": {
            "suppliers_count": len(suppliers),
            "inventory_records": len(inventory),
            "shipments_count": len(shipments)
        },
        "recovery_plan": recovery_plan,
        "financial_analysis": financial_analysis,
        "requires_human_approval": True
    }
