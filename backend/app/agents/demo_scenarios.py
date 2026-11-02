
"""Clearly labelled demo scenarios for testing the recovery workflow.

These are synthetic examples, not records fetched from SAP HANA.
"""

DEMO_SCENARIOS = {
    501: {
        "disruption_id": 501,
        "industry": "pharmaceuticals",
        "currency": "USD",
        "shipments": [
            {
                "shipment_id": "SHP-501",
                "supplier": "Supplier A",
                "delay_days": 3,
                "status": "delayed",
            }
        ],
        "inventory": [
            {
                "material_id": "MAT-501",
                "available_units": 20,
                "daily_demand": 25,
            }
        ],
        "factories": [
            {
                "factory_id": "FAC-501",
                "required_materials": ["MAT-501"],
            }
        ],
        "orders": [
            {
                "order_id": "ORD-501",
                "customer": "Customer A",
                "required_materials": ["MAT-501"],
                "order_value": 50000,
                "shipment_id": "SHP-501",
            }
        ],
        "required_units": 80,
        "delay_cost_per_day": 1000,
        "disrupted_suppliers": ["Supplier A"],
        "approved_suppliers": ["Supplier C"],
        "alternative_suppliers": [
            {
                "supplier": "Supplier B",
                "materials": ["MAT-501"],
                "available_units": 100,
                "cost_per_unit": 12,
                "lead_time_days": 1,
            },
            {
                "supplier": "Supplier C",
                "materials": ["MAT-501"],
                "available_units": 200,
                "cost_per_unit": 9,
                "lead_time_days": 2,
            },
        ],
    },
    502: {
        "disruption_id": 502,
        "industry": "manufacturing",
        "currency": "USD",
        "shipments": [
            {
                "shipment_id": "SHP-502",
                "supplier": "Supplier D",
                "delay_days": 1,
                "status": "delayed",
            }
        ],
        "inventory": [
            {
                "material_id": "MAT-502",
                "available_units": 10,
                "daily_demand": 20,
            }
        ],
        "factories": [
            {
                "factory_id": "FAC-502",
                "required_materials": ["MAT-502"],
            }
        ],
        "orders": [
            {
                "order_id": "ORD-502",
                "customer": "Customer B",
                "required_materials": ["MAT-502"],
                "order_value": 30000,
                "shipment_id": "SHP-502",
            }
        ],
        "required_units": 50,
        "delay_cost_per_day": 800,
        "disrupted_suppliers": ["Supplier D"],
        "approved_suppliers": [],
        "alternative_suppliers": [
            {
                "supplier": "Supplier E",
                "materials": ["MAT-502"],
                "available_units": 100,
                "cost_per_unit": 7,
                "lead_time_days": 2,
            },
            {
                "supplier": "Supplier F",
                "materials": ["MAT-502"],
                "available_units": 80,
                "cost_per_unit": 6,
                "lead_time_days": 4,
            },
        ],
    },
    503: {
        "disruption_id": 503,
        "industry": "manufacturing",
        "currency": "USD",
        "shipments": [
            {
                "shipment_id": "SHP-503",
                "supplier": "Supplier G",
                "delay_days": 4,
                "status": "failed",
            }
        ],
        "inventory": [
            {
                "material_id": "MAT-503",
                "available_units": 0,
                "daily_demand": 30,
            }
        ],
        "factories": [
            {
                "factory_id": "FAC-503",
                "required_materials": ["MAT-503"],
            }
        ],
        "orders": [
            {
                "order_id": "ORD-503",
                "customer": "Customer C",
                "required_materials": ["MAT-503"],
                "order_value": 75000,
                "shipment_id": "SHP-503",
            }
        ],
        "required_units": 120,
        "delay_cost_per_day": 1500,
        "disrupted_suppliers": ["Supplier G"],
        "approved_suppliers": [],
        "alternative_suppliers": [
            {
                "supplier": "Supplier H",
                "materials": ["MAT-503"],
                "available_units": 40,
                "cost_per_unit": 10,
                "lead_time_days": 2,
            },
            {
                "supplier": "Supplier I",
                "materials": ["MAT-503"],
                "available_units": 60,
                "cost_per_unit": 8,
                "lead_time_days": 3,
            },
        ],
    },
}


def get_demo_scenario(disruption_id: int) -> dict:
    """Return a copy of a demo scenario or raise KeyError."""
    from copy import deepcopy

    if disruption_id not in DEMO_SCENARIOS:
        raise KeyError(f"Unknown demo disruption ID: {disruption_id}")

    return deepcopy(DEMO_SCENARIOS[disruption_id])
