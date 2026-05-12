from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/api/catalog", tags=["catalog-public"])


@router.get("/countries", response_model=list[schemas.CountryRead])
def list_countries(db: Session = Depends(get_db)):
    return crud.get_all_countries(db)


@router.get("/brands", response_model=list[schemas.BrandRead])
def list_brands(db: Session = Depends(get_db)):
    return crud.get_all_brands(db)


@router.get("/products", response_model=schemas.ProductListResponse)
def list_products(
    brand_ids: Optional[list[int]] = Query(default=None, alias="brand_ids[]"),
    country_ids: Optional[list[int]] = Query(default=None, alias="country_ids[]"),
    gender: Optional[str] = None,
    price_min: Optional[Decimal] = None,
    price_max: Optional[Decimal] = None,
    is_hit: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    result = crud.list_products_public(
        db,
        brand_ids=brand_ids,
        country_ids=country_ids,
        gender=gender,
        price_min=price_min,
        price_max=price_max,
        is_hit=is_hit,
        search=search,
        page=page,
        limit=limit,
    )
    return result


@router.get("/products/{slug}", response_model=schemas.ProductDetail)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = crud.get_product_by_slug_public(db, slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
