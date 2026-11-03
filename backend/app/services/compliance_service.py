# Industry compliance validation.

"""Compliance validation service."""

from app.agents.compliance_agent import validate_recovery_options


def check_compliance(
    recovery_result: dict,
    scenario: dict
) -> dict:
    result = validate_recovery_options(
        recovery_result,
        scenario
    )

    result["requires_human_approval"] = True

    if scenario.get("industry", "unknown").lower() == "unknown":
        result["data_limitation"] = (
            "Industry classification is unavailable for this incident. "
            "Industry-specific compliance could not be fully verified."
        )

    result["validation_source"] = "Available scenario compliance records"

    return result
