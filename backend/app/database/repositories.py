# Database read/write functions used by services.

from app.database.hana import get_connection


def fetch_all(query):
    """Execute a SELECT query and return rows as dictionaries."""
    connection = get_connection()

    try:
        cursor = connection.cursor()
        cursor.execute(query)

        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()

        return [
            dict(zip(columns, row))
            for row in rows
        ]

    finally:
        cursor.close()
        connection.close()


def get_suppliers():
    return fetch_all("""
        SELECT *
        FROM SUPPLIERS
        ORDER BY SUPPLIER_ID
    """)


def get_warehouses():
    return fetch_all("""
        SELECT *
        FROM WAREHOUSES
        ORDER BY WAREHOUSE_ID
    """)


def get_inventory():
    return fetch_all("""
        SELECT *
        FROM INVENTORY
        ORDER BY INVENTORY_ID
    """)


def get_shipments():
    return fetch_all("""
        SELECT *
        FROM SHIPMENTS
        ORDER BY SHIPMENT_ID
    """)


def get_disruptions():
    return fetch_all("""
        SELECT *
        FROM DISRUPTIONS
        ORDER BY INCIDENT_ID
    """)


def get_recovery_plans():
    return fetch_all("""
        SELECT *
        FROM RECOVERY_PLANS
        ORDER BY PLAN_ID
    """)


def get_industries():
    return fetch_all("""
        SELECT *
        FROM INDUSTRIES
        ORDER BY INDUSTRY_ID
    """)
