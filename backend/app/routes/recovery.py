# Recovery and approval API routes.


"""Recovery analysis API routes."""

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents.demo_scenarios import get_demo_scenario
from app.agents.orchestrator import run_recovery_workflow

router = APIRouter(prefix="/api/recovery", tags=["Recovery"])


class RecoveryRequest(BaseModel):
    scenario: dict[str, Any] = Field(
        ...,
        description="Supply-chain scenario to analyze for disruptions and recovery options.",
    )


@router.post("/analyze")
def analyze_recovery(request: RecoveryRequest) -> dict[str, Any]:
    """Analyze a supplied supply-chain scenario."""
    try:
        return run_recovery_workflow(request.scenario)
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid recovery scenario: {exc}",
        ) from exc


@router.post("/workflow/run/{disruption_id}")
def run_demo_disruption_workflow(disruption_id: int) -> dict[str, Any]:
    """Run the workflow for a clearly labelled demo disruption ID."""
    try:
        scenario = get_demo_scenario(disruption_id)
        result = run_recovery_workflow(scenario)
        result["data_source"] = "synthetic_demo"
        result["disruption_id"] = disruption_id
        return result
    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid demo scenario: {exc}",
        ) from exc
