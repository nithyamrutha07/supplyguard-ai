# Recovery and approval API routes.

"""Recovery analysis API route."""

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents.orchestrator import run_recovery_workflow

router = APIRouter(prefix="/api/recovery", tags=["Recovery"])


class RecoveryRequest(BaseModel):
    scenario: dict[str, Any] = Field(
        ...,
        description="Supply-chain scenario to analyze for disruptions and recovery options.",
    )


@router.post("/analyze")
def analyze_recovery(request: RecoveryRequest) -> dict[str, Any]:
    """Analyze a supply-chain scenario and recommend a recovery option."""
    try:
        return run_recovery_workflow(request.scenario)
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid recovery scenario: {exc}",
        ) from exc
