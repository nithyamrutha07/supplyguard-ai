
# Recovery and approval API routes.

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal

from app.database.repositories import get_recovery_plans
from app.database.hana import get_connection

router = APIRouter(prefix="/api", tags=["Recovery"])


class RecoveryDecision(BaseModel):
    decision: Literal["APPROVED", "REJECTED"]


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
