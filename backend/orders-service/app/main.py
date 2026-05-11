import os

import httpx
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import Base, engine, get_db

Base.metadata.create_all(bind=engine)

CATALOG_SERVICE_URL = os.environ.get("CATALOG_SERVICE_URL", "http://catalog-service:8000")

app = FastAPI(title="orders-service", version="0.0.1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "orders-service"}


@app.get("/health/catalog")
async def health_catalog() -> dict[str, str]:
    """Проверка связи с catalog-service по docker-compose-сети."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{CATALOG_SERVICE_URL}/health")
            resp.raise_for_status()
            return {"status": "ok", "catalog": resp.json()}
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail=f"catalog unreachable: {exc}") from exc


@app.post("/items", response_model=schemas.ItemRead, status_code=201)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db, payload)


@app.get("/items", response_model=list[schemas.ItemRead])
def list_items(db: Session = Depends(get_db)):
    return crud.list_items(db)
