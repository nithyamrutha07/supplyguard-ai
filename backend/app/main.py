from fastapi import FastAPI

app = FastAPI(title="SupplyGuard AI", version="0.1.0")

@app.get("/")
def root():
    return {"message": "SupplyGuard AI backend is running"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
