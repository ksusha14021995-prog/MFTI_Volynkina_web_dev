import os

import httpx
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session

from app.db import Base, SessionLocal, engine
from app.routers import cart, orders, pickup
from app import crud

Base.metadata.create_all(bind=engine)

CATALOG_SERVICE_URL = os.environ.get("CATALOG_SERVICE_URL", "http://catalog-service:8000")

app = FastAPI(title="orders-service", version="1.0.0")

# Seed reference data on startup
@app.on_event("startup")
def startup_seed():
    db: Session = SessionLocal()
    try:
        crud.seed_statuses(db)
        crud.seed_pickup_points(db)
    finally:
        db.close()

app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(pickup.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "orders-service"}


@app.get("/health/catalog")
async def health_catalog() -> dict:
    """Check connectivity to catalog-service."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{CATALOG_SERVICE_URL}/health")
            resp.raise_for_status()
            return {"status": "ok", "catalog": resp.json()}
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail=f"catalog unreachable: {exc}") from exc
