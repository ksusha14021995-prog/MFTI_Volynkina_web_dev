from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="catalog-service", version="0.0.1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "catalog-service"}


@app.post("/items", response_model=schemas.ItemRead, status_code=201)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db, payload)


@app.get("/items", response_model=list[schemas.ItemRead])
def list_items(db: Session = Depends(get_db)):
    return crud.list_items(db)
