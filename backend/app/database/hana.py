import os
from dotenv import load_dotenv
from hdbcli import dbapi

load_dotenv()


def get_connection():
    return dbapi.connect(
        address=os.getenv("HANA_HOST"),
        port=int(os.getenv("HANA_PORT", 443)),
        user=os.getenv("HANA_USER"),
        password=os.getenv("HANA_PASSWORD"),
        encrypt=True
    )


def test_hana_connection():
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT CURRENT_USER FROM DUMMY")
        result = cursor.fetchone()
        print("SAP HANA Connected:", result[0])
        cursor.close()
    finally:
        connection.close()