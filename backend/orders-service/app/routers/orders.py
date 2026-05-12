import os
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/api/orders", tags=["orders"])

CATALOG_SERVICE_URL = os.environ.get("CATALOG_SERVICE_URL", "http://catalog-service:8000")


def _require_session(x_session_id: str = Header(...)) -> str:
    return x_session_id


async def _fetch_variant_info(variant_id: int) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.get(f"{CATALOG_SERVICE_URL}/internal/variants/{variant_id}")
        if resp.status_code == 404:
            raise HTTPException(status_code=422, detail=f"Variant {variant_id} not found in catalog")
        resp.raise_for_status()
        return resp.json()


async def _reserve_variants(items: list[dict]) -> None:
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.post(
            f"{CATALOG_SERVICE_URL}/internal/variants/reserve",
            json={"items": items},
        )
        if resp.status_code == 409:
            detail = resp.json().get("detail", "out_of_stock")
            raise HTTPException(status_code=409, detail=detail)
        resp.raise_for_status()


async def _release_variants(items: list[dict]) -> None:
    async with httpx.AsyncClient(timeout=5.0) as client:
        await client.post(
            f"{CATALOG_SERVICE_URL}/internal/variants/release",
            json={"items": items},
        )


@router.post("", response_model=schemas.OrderRead, status_code=201)
async def create_order(
    payload: schemas.CreateOrderRequest,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    cart = crud.get_or_create_cart(db, session_id)
    if not cart.items:
        raise HTTPException(status_code=422, detail="Cart is empty")

    pickup_point = crud.get_pickup_point_by_id(db, payload.pickup_point_id)
    if not pickup_point or not pickup_point.is_active:
        raise HTTPException(status_code=422, detail="Pickup point not found or inactive")

    # Fetch variant info from catalog
    variant_infos = {}
    for ci in cart.items:
        info = await _fetch_variant_info(ci.product_variant_id)
        variant_infos[ci.product_variant_id] = info

    # Reserve stock
    reserve_items = [
        {"variant_id": ci.product_variant_id, "quantity": ci.quantity}
        for ci in cart.items
    ]
    await _reserve_variants(reserve_items)

    # Create order
    order = crud.create_order(db, session_id, payload, variant_infos)
    return order


@router.get("", response_model=list[schemas.OrderListItem])
def list_orders(
    email: Optional[str] = None,
    session_id: str = Depends(_require_session),
    db: Session = Depends(get_db),
):
    return crud.list_orders_by_session_or_email(db, session_id, email)


@router.get("/{order_number}", response_model=schemas.OrderRead)
def get_order(order_number: str, db: Session = Depends(get_db)):
    order = crud.get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_number}/cancel", response_model=schemas.OrderRead)
async def cancel_order(order_number: str, db: Session = Depends(get_db)):
    order = crud.get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status.code != "assembly":
        raise HTTPException(
            status_code=403,
            detail=f"Cannot cancel order in status '{order.status.code}'. Only 'assembly' orders can be cancelled.",
        )

    # Release reserved stock
    release_items = [
        {"variant_id": item.product_variant_id, "quantity": item.quantity}
        for item in order.items
    ]
    await _release_variants(release_items)

    updated = crud.cancel_order(db, order_number)
    return updated
