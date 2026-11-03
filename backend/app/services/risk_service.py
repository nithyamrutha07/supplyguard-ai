# Risk scoring and prioritisation.

"""Rule-based supply chain risk scoring."""

SEVERITY_SCORES = {
    "LOW": 25,
    "MEDIUM": 50,
    "HIGH": 75,
    "CRITICAL": 100
}


def calculate_risk(disruption_result: dict) -> dict:
    disruptions = disruption_result.get("disruptions", [])

    if not disruptions:
        severity = str(
            disruption_result.get("overall_risk", "UNKNOWN")
        ).upper()

        score = SEVERITY_SCORES.get(severity)
        if score is None:
            return {
                "risk_score": None,
                "risk_level": "unknown",
                "method": "rule_based_severity_mapping",
                "note": "No disruption records were available."
            }

        return {
            "risk_score": score,
            "risk_level": severity.lower(),
            "method": "rule_based_severity_mapping"
        }

    scores = []

    for item in disruptions:
        severity = str(item.get("severity", "UNKNOWN")).upper()
        score = SEVERITY_SCORES.get(severity)

        if score is not None:
            scores.append(score)

    if not scores:
        return {
            "risk_score": None,
            "risk_level": "unknown",
            "method": "rule_based_severity_mapping",
            "note": "Disruption severity data is unavailable."
        }

    average_score = round(sum(scores) / len(scores))

    if average_score >= 85:
        level = "critical"
    elif average_score >= 65:
        level = "high"
    elif average_score >= 40:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_score": average_score,
        "risk_level": level,
        "disruption_count": len(disruptions),
        "method": "rule_based_severity_mapping",
        "note": "This is a rule-based score, not an ML prediction."
    }
