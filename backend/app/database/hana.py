
import os

from dotenv import load_dotenv
from hdbcli import dbapi

load_dotenv()


def get_connection():
    """Create or reuse a pooled SAP HANA connection."""

    required = ["HANA_HOST", "HANA_USER", "HANA_PASSWORD"]
    missing = [key for key in required if not os.getenv(key)]

    if missing:
        raise RuntimeError(
            f"Missing SAP HANA environment variables: {', '.join(missing)}"
        )

    return dbapi.connect(
        address=os.getenv("HANA_HOST"),
        port=int(os.getenv("HANA_PORT", "443")),
        user=os.getenv("HANA_USER"),
        password=os.getenv("HANA_PASSWORD"),
        encrypt=True,
        pooling=True,
        maxPoolSize=10,
    )


def test_hana_connection():
    connection = get_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT CURRENT_USER FROM DUMMY")
        result = cursor.fetchone()

        if not result:
            raise RuntimeError("SAP HANA returned no connection result.")

        return {
            "connected": True,
            "current_user": result[0],
        }

    finally:
        if cursor is not None:
            cursor.close()
        connection.close()
