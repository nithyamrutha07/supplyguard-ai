
from datetime import date, datetime

from fastapi import APIRouter, HTTPException

from app.agents.orchestrator import run_recovery_workflow
from app.database.repositories import (
    get_disruptions,
    get_suppliers,
    get_inventory,
    get_shipments,
    get_recovery_plans,
)

router = APIRouter(prefix="/api/workflow", tags=["Workflow"])


def parse_date(value):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return date.fromisoformat(value[:10])
    return None


@router.get("/run/{incident_id}")
def run_workflow(incident_id: int):
    try:
        # Fetch live records from SAP HANA.
        disruptions = get_disruptions()
        suppliers = get_suppliers()
        inventory = get_inventory()
        shipments = get_shipments()
        recovery_plans = get_recovery_plans()

        incident = next(
            (
                row for row in disruptions
                if int(row["INCIDENT_ID"]) == incident_id
            ),
            None,
        )

        if incident is None:
            raise HTTPException(
                status_code=404,
                detail=f"Incident {incident_id} not found in SAP HANA",
            )

        supplier_lookup = {
            int(row["SUPPLIER_ID"]): row["SUPPLIER_NAME"]
            for row in suppliers
        }

        agent_shipments = []

        for shipment in shipments:
            expected = parse_date(shipment.get("EXPECTED_DATE"))
            actual = parse_date(shipment.get("ACTUAL_DATE"))
            status = str(shipment.get("STATUS", "")).lower()

            delay_days = 0

            if actual and expected:
                delay_days = max(0, (actual - expected).days)
            elif status == "delayed" and expected:
                delay_days = max(1, (date.today() - expected).days)
            elif status == "delayed":
                delay_days = 1

            supplier_id = shipment.get("SUPPLIER_ID")

            agent_shipments.append({
                "shipment_id": str(shipment["SHIPMENT_ID"]),
                "supplier": supplier_lookup.get(
                    int(supplier_id), "Unknown supplier"
                ) if supplier_id is not None else "Unknown supplier",
                "delay_days": delay_days,
                "status": status,
            })

        agent_inventory = [
            {
                "material_id": str(row["MATERIAL_NAME"]),
                "available_units": int(row.get("AVAILABLE_QUANTITY") or 0),
                "daily_demand": 0,
            }
            for row in inventory
        ]

        disrupted_supplier_names = [
            shipment["supplier"]
            for shipment in agent_shipments
            if shipment["status"] in {
                "delayed",
                "failed",
                "cancelled",
                "supplier_failure",
            }
        ]

        description = str(incident.get("DESCRIPTION", "")).lower()

        industry = (
            "pharmaceuticals"
            if "medicine" in description or "pharma" in description
            else "manufacturing"
        )

        scenario = {
            "industry": industry,
            "shipments": agent_shipments,
            "inventory": agent_inventory,
            "factories": [],
            "orders": [],
            "needed_materials": [],
            "disrupted_suppliers": disrupted_supplier_names,
            "alternative_suppliers": [],
            "approved_suppliers": [],
            "prohibited_suppliers": [],
            "currency": "INR",
            "required_units": 0,
        }

        # Execute the AI agent workflow.
        result = run_recovery_workflow(scenario)

        # Attach the original SAP HANA incident values.
        result["incident_id"] = incident_id
        result["hana_incident"] = incident
        result["overall_risk"] = incident.get(
            "SEVERITY", result.get("overall_risk")
        )
        result["estimated_loss"] = incident.get("ESTIMATED_LOSS", 0)
        result["incident_status"] = incident.get("STATUS")

        # Attach existing recovery plans for this incident.
        result["existing_recovery_plans"] = [
            plan for plan in recovery_plans
            if int(plan["INCIDENT_ID"]) == incident_id
        ]

        result["hana_data_summary"] = {
            "suppliers_loaded": len(suppliers),
            "inventory_records_loaded": len(inventory),
            "shipments_loaded": len(shipments),
            "disruptions_loaded": len(disruptions),
        }

        result["data_limitations"] = [
            "Daily material demand is not available in the current database.",
            "Supplier-to-material mappings and alternative supplier stock are not available.",
            "Customer orders and factory dependencies are not stored.",
            "New recovery recommendations require these additional business records.",
        ]

        result["requires_human_approval"] = True
        result["recovery_executed"] = False

        return result

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"SAP HANA workflow failed: {str(exc)}",
        )
