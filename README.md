# SupplyGuard AI – project scaffold

This is an organised starter structure. It does not contain your existing implementation or SAP credentials.

## Teams
- `backend/`: backend team owns APIs, business logic, agents, HANA connection and SAP AI integrations.
- `frontend/`: frontend team owns React UI, maps, dependency graph and charts.
- `database/`: shared SQL schema and seed data; backend owns applying and maintaining it.

## Run backend
From `backend/`:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Create `backend/.env` from `.env.example` and fill in your own SAP HANA Cloud credentials. Never commit `.env`.
