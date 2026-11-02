from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
def test_recovery_endpoint_recommends_approved_supplier():
    scenario = {
        "industry": "pharmaceuticals",
        "currency": "USD",
        "shipments": [
            {
                "shipment_id": "SHP-101",
                "supplier": "Supplier A",
                "delay_days": 2,
                "status": "delayed",
            }
        ],
        "inventory": [
            {
                "material_id": "MAT-101",
                "available_units": 15,
                "daily_demand": 15,
            }
        ],
        "factories": [
            {
                "factory_id": "FAC-01",
                "required_materials": ["MAT-101"],
            }
        ],
        "orders": [
            {
                "order_id": "ORD-01",
                "customer": "Customer A",
                "required_materials": ["MAT-101"],
                "order_value": 50000,
            }
        ],
        "required_units": 80,
        "delay_cost_per_day": 1000,
        "disrupted_suppliers": ["Supplier A"],
        "approved_suppliers": ["Supplier C"],
        "alternative_suppliers": [
            {
                "supplier": "Supplier B",
                "materials": ["MAT-101"],
                "available_units": 100,
                "cost_per_unit": 12,
                "lead_time_days": 1,
            },
            {
                "supplier": "Supplier C",
                "materials": ["MAT-101"],
                "available_units": 200,
                "cost_per_unit": 9,
                "lead_time_days": 3,
            },
        ],
    }

    response = client.post(
        "/api/recovery/analyze",
        json={"scenario": scenario},
    )

    assert response.status_code == 200

    result = response.json()
    assert result["status"] == "recommendation_ready"
    assert result["recommendation"]["supplier"] == "Supplier C"
    assert result["requires_human_approval"] is True
    assert result["recovery_executed"] is False
    
def test_demo_disruption_workflows():
    expected = {
        501: ("recommendation_ready", "Supplier C"),
        502: ("recommendation_ready", "Supplier E"),
        503: ("manual_review_required", None),
    }

    for disruption_id, (expected_status, expected_supplier) in expected.items():
        response = client.post(
            f"/api/recovery/workflow/run/{disruption_id}"
        )

        assert response.status_code == 200
        result = response.json()

        assert result["disruption_id"] == disruption_id
        assert result["data_source"] == "synthetic_demo"
        assert result["requires_human_approval"] is True
        assert result["recovery_executed"] is False
        assert result["status"] == expected_status

        if expected_supplier is None:
            assert result["recommendation"] is None
        else:
            assert result["recommendation"]["supplier"] == expected_supplier


def test_unknown_demo_disruption_returns_404():
    response = client.post("/api/recovery/workflow/run/999")

    assert response.status_code == 404

def test_logistics_cost_uses_required_quantity():
    from app.agents.logistics_agent import evaluate_logistics

    scenario = {
        "required_units": 80,
        "needed_materials": ["MAT-1"],
        "disrupted_suppliers": [],
        "alternative_suppliers": [
            {
                "supplier": "Supplier A",
                "materials": ["MAT-1"],
                "available_units": 100,
                "cost_per_unit": 12,
                "lead_time_days": 2,
            }
        ],
    }

    result = evaluate_logistics(scenario)

    assert result["alternatives"][0]["estimated_cost"] == 960
    
def test_recovery_rejects_negative_delay_cost():
    scenario = {
        "required_units": 10,
        "delay_cost_per_day": -100,
        "alternative_suppliers": [],
    }

    response = client.post(
        "/api/recovery/analyze",
        json={"scenario": scenario},
    )

    assert response.status_code == 400
    assert "delay_cost_per_day must be a non-negative number" in response.json()["detail"]
    
def test_pharmaceutical_workflow_rejects_all_unapproved_suppliers():
    scenario = {
        "industry": "pharmaceuticals",
        "required_units": 10,
        "needed_materials": ["MAT-1"],
        "delay_cost_per_day": 100,
        "approved_suppliers": ["Approved Supplier"],
        "alternative_suppliers": [
            {
                "supplier": "Unapproved Supplier",
                "materials": ["MAT-1"],
                "available_units": 20,
                "cost_per_unit": 5,
                "lead_time_days": 1,
            }
        ],
        "inventory": [],
        "shipments": [],
        "factories": [],
        "orders": [],
    }

    response = client.post(
        "/api/recovery/analyze",
        json={"scenario": scenario},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["recommendation"] is None
    assert result["status"] == "manual_review_required"
    assert result["compliance"]["status"] == "no_compliant_options"
    assert result["compliance"]["rejected_options"][0]["supplier"] == "Unapproved Supplier"



