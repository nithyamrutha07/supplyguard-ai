
from app.database.hana import get_connection


def fetch_all(query):
    connection = get_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        return [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]
    finally:
        if cursor:
            cursor.close()
        connection.close()


def fetch_dashboard_data():
    connection = get_connection()
    cursor = None

    queries = {
        "suppliers": "SELECT * FROM SUPPLIERS ORDER BY SUPPLIER_ID",
        "inventory": "SELECT * FROM INVENTORY ORDER BY INVENTORY_ID",
        "shipments": "SELECT * FROM SHIPMENTS ORDER BY SHIPMENT_ID",
        "disruptions": "SELECT * FROM DISRUPTIONS ORDER BY INCIDENT_ID",
        "recovery_plans": "SELECT * FROM RECOVERY_PLANS ORDER BY PLAN_ID",
        "industries": "SELECT * FROM INDUSTRIES ORDER BY INDUSTRY_ID",
    }

    try:
        cursor = connection.cursor()
        results = {}

        for name, query in queries.items():
            cursor.execute(query)
            columns = [column[0] for column in cursor.description]
            results[name] = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]

        return results
    finally:
        if cursor:
            cursor.close()
        connection.close()


def get_suppliers():
    return fetch_all("SELECT * FROM SUPPLIERS ORDER BY SUPPLIER_ID")


def get_inventory():
    return fetch_all("SELECT * FROM INVENTORY ORDER BY INVENTORY_ID")


def get_shipments():
    return fetch_all("SELECT * FROM SHIPMENTS ORDER BY SHIPMENT_ID")


def get_disruptions():
    return fetch_all("SELECT * FROM DISRUPTIONS ORDER BY INCIDENT_ID")


def get_recovery_plans():
    return fetch_all("SELECT * FROM RECOVERY_PLANS ORDER BY PLAN_ID")


def get_industries():
    return fetch_all("SELECT * FROM INDUSTRIES ORDER BY INDUSTRY_ID")
def get_warehouses():
    return fetch_all("SELECT * FROM WAREHOUSES ORDER BY WAREHOUSE_ID")