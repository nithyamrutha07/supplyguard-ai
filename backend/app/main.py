
from fastapi import FastAPI

from app.routes.recovery import router as recovery_router
from app.routes.recovery import run_demo_disruption_workflow

app = FastAPI(title="SupplyGuard AI", version="0.1.0")

app.include_router(recovery_router)
app.add_api_route(
    "/api/workflow/run/{disruption_id}",
    run_demo_disruption_workflow,
    methods=["POST"],
    tags=["Workflow"],
)


@app.get("/")
def root():
    return {"message": "SupplyGuard AI backend is running"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
