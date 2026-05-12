from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/api/cart", tags=["cart"])


def _require_session(x_session_id: str = Header(...)) -> str:
    return x_session_id


@router.get("", response_model=schemas.CartRead)
def get_cart(session_id: str = Depends(_require_session), db: Session = Depends(get_db)):
    return crud.get_or_create_cart(db, session_id)


@router.post("/items", response_model=schemas.CartRead, status_code=201)
def add_item(
    payload: schemas.AddCartItemRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return crud.add_cart_item(db, session_id, payload)


@router.patch("/items/{item_id}", response_model=schemas.CartRead)
def update_item(
    item_id: int,
    payload: schemas.UpdateCartItemRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    cart = crud.update_cart_item(db, session_id, item_id, payload.quantity)
    if cart is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart


@router.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    ok = crud.delete_cart_item(db, session_id, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Cart item not found")


@router.delete("", status_code=204)
def clear_cart(session_id: str = Depends(_require_session), db: Session = Depends(get_db)):
    crud.clear_cart(db, session_id)
