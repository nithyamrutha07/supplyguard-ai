def get_demo_scenario(incident_id: int) -> dict:
    scenarios = {
        501: {
            "industry": "manufacturing",
            "required_units": 500,
            "delay_cost_per_day": 50000,
            "needed_materials": ["Steel", "Electronic Components"],
            "disrupted_suppliers": ["Precision Components"],
        },
        502: {
            "industry": "manufacturing",
            "required_units": 300,
            "delay_cost_per_day": 30000,
            "needed_materials": ["Electronic Components"],
            "disrupted_suppliers": [],
        },
        503: {
            "industry": "pharmaceutical",
            "required_units": 200,
            "delay_cost_per_day": 60000,
            "needed_materials": ["Medicine", "Temperature-Controlled Packaging"],
            "disrupted_suppliers": ["LifeCare Pharma"],
        },
    }

    if incident_id not in scenarios:
        raise KeyError(f"Unknown demo incident ID: {incident_id}")

    return scenarios[incident_id].copy()
