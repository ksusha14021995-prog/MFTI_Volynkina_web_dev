from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/internal", tags=["catalog-internal"])


@router.get("/variants/{variant_id}", response_model=schemas.InternalVariantRead)
def get_variant(variant_id: int, db: Session = Depends(get_db)):
    variant = crud.get_variant_internal(db, variant_id)
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    return variant


@router.post("/variants/reserve", status_code=200)
def reserve_variants(payload: schemas.ReserveRequest, db: Session = Depends(get_db)):
    try:
        crud.reserve_variants(db, payload.items)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=exc.args[0])
    return {"status": "reserved"}


@router.post("/variants/release", status_code=200)
def release_variants(payload: schemas.ReserveRequest, db: Session = Depends(get_db)):
    crud.release_variants(db, payload.items)
    return {"status": "released"}
