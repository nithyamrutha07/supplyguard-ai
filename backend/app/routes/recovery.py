
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database.repositories import get_recovery_plans
from app.database.hana import get_connection
from app.agents.orchestrator import run_recovery_workflow


router = APIRouter(prefix="/api", tags=["Recovery"])


class RecoveryDecision(BaseModel):
    decision: Literal["APPROVED", "REJECTED"]


class RecoveryAnalysisRequest(BaseModel):
    scenario: dict


# 1. Get all existing recovery plans
@router.get("/recovery")
def read_recovery_plans():
    try:
        data = get_recovery_plans()

        return {
            "success": True,
            "count": len(data),
            "data": data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch recovery plans: {str(e)}"
        )


# 2. Analyze a scenario and generate a recovery recommendation
@router.post("/recovery/analyze")
def analyze_recovery(request: RecoveryAnalysisRequest):
    try:
        result = run_recovery_workflow(request.scenario)

        # Return the workflow result directly so that
        # status, recommendation, and other fields are top-level.
        return result

    except (TypeError, ValueError) as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Recovery analysis failed: {str(e)}"
        )


# 3. Approve or reject an existing recovery plan
@router.put("/recovery/{plan_id}/decision")
def update_recovery_decision(
    plan_id: int,
    request: RecoveryDecision
):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT PLAN_STATUS
            FROM RECOVERY_PLANS
            WHERE PLAN_ID = ?
            """,
            (plan_id,)
        )

        existing_plan = cursor.fetchone()

        if existing_plan is None:
            raise HTTPException(
                status_code=404,
                detail="Recovery plan not found"
            )

        if existing_plan[0] != "PROPOSED":
            raise HTTPException(
                status_code=409,
                detail="Only proposed recovery plans can be approved or rejected"
            )

        cursor.execute(
            """
            UPDATE RECOVERY_PLANS
            SET PLAN_STATUS = ?
            WHERE PLAN_ID = ?
            """,
            (request.decision, plan_id)
        )

        connection.commit()

        return {
            "success": True,
            "message": f"Recovery plan {request.decision.lower()} successfully",
            "plan_id": plan_id,
            "status": request.decision
        }

    except HTTPException:
        if connection:
            connection.rollback()
        raise

    except Exception as e:
        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update recovery decision: {str(e)}"
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
