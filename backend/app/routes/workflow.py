
from fastapi import APIRouter, HTTPException
from app.agents.orchestrator import run_supply_chain_workflow

router = APIRouter(prefix="/api/workflow", tags=["AI Workflow"])


@router.get("/run/{incident_id}")
def run_workflow(incident_id: int):
    try:
        result = run_supply_chain_workflow(incident_id)

        if result is None:
            raise HTTPException(
                status_code=404,
                detail="Disruption not found"
            )

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Workflow failed: {str(e)}"
        )
