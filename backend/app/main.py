
from fastapi import FastAPI

from app.routes.recovery import router as recovery_router

app = FastAPI(title="SupplyGuard AI", version="0.1.0")

app.include_router(recovery_router)


@app.get("/")
def root():
    return {"message": "SupplyGuard AI backend is running"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
