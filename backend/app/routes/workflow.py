from fastapi import APIRouter, HTTPException

from app.services.scenario_service import build_hana_scenario
from app.agents.orchestrator import run_recovery_workflow

router = APIRouter(prefix="/api/workflow", tags=["Workflow"])


@router.get("/run/{incident_id}")
def run_workflow(incident_id: int):
    try:
        scenario = build_hana_scenario(incident_id)

        if scenario is None:
            raise HTTPException(
                status_code=404,
                detail=f"Incident {incident_id} not found in SAP HANA",
            )

        result = run_recovery_workflow(scenario)

        result["incident_id"] = incident_id
        result["incident_details"] = scenario["incident"]
        result["data_source"] = "SAP HANA Cloud"

        return result

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Workflow execution failed: {str(exc)}",
        )