
# SupplyGuard AI – Backend API Documentation

Base URL: http://127.0.0.1:8000

## 1. Health
GET /api/health
GET /api/health/database

## 2. Suppliers
GET /api/suppliers

## 3. Inventory
GET /api/inventory

## 4. Shipments
GET /api/shipments

## 5. Disruptions
GET /api/disruptions

## 6. Recovery Plans
GET /api/recovery

## 7. Dashboard
GET /api/dashboard

## 8. Supply Chain Maps
GET /api/maps/nodes
GET /api/maps/shipments

## 9. Impact Analysis
GET /api/impact/analyze/{incident_id}

Example:
GET /api/impact/analyze/501

## Technology
- Python
- FastAPI
- SAP HANA Cloud
- hdbcli
- REST API
