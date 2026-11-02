
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routes.impact import router as impact_router
from app.routes.workflow import router as workflow_router


from app.database.hana import get_connection

from app.routes.suppliers import router as suppliers_router
from app.routes.inventory import router as inventory_router
from app.routes.shipments import router as shipments_router
from app.routes.disruptions import router as disruptions_router
from app.routes.recovery import router as recovery_router
from app.routes.dashboard import router as dashboard_router
from app.routes.maps import router as maps_router


app = FastAPI(
    title="SupplyGuard AI",
    description="AI-powered Supply Chain Resilience Platform",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(suppliers_router)
app.include_router(inventory_router)
app.include_router(shipments_router)
app.include_router(disruptions_router)
app.include_router(recovery_router)
app.include_router(dashboard_router)
app.include_router(maps_router)
app.include_router(impact_router)
app.include_router(workflow_router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "SupplyGuard AI backend is running",
        "status": "success"
    }


# Backend health
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        
    }


# SAP HANA database health
@app.get("/api/health/database")
def database_health():
    connection = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT CURRENT_USER FROM DUMMY")
        result = cursor.fetchone()

        cursor.close()

        return {
            "status": "connected",
            "database": "SAP HANA Cloud",
            "user": result[0]
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="SAP HANA database connection failed"
        )

    finally:
        if connection:
            connection.close()
