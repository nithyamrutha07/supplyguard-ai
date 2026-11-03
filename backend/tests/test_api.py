
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


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
