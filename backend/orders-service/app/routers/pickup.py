from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/api/pickup-points", tags=["pickup-points"])


@router.get("", response_model=list[schemas.PickupPointRead])
def list_pickup_points(db: Session = Depends(get_db)):
    return crud.get_active_pickup_points(db)
