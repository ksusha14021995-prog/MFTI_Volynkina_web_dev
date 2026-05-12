from decimal import Decimal
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app import models, schemas


# --- Countries ---

def get_all_countries(db: Session) -> list[models.Country]:
    return db.query(models.Country).order_by(models.Country.name).all()


# --- Brands ---

def get_all_brands(db: Session) -> list[models.Brand]:
    return (
        db.query(models.Brand)
        .options(joinedload(models.Brand.country))
        .order_by(models.Brand.name)
        .all()
    )


def create_brand(db: Session, payload: schemas.BrandCreate) -> models.Brand:
    brand = models.Brand(
        name=payload.name,
        slug=payload.slug,
        country_id=payload.country_id,
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return db.query(models.Brand).options(joinedload(models.Brand.country)).get(brand.id)


# --- Products (public) ---

def _build_product_list_item(p: models.Product) -> dict:
    prices = [v.price for v in p.variants]
    return {
        "id": p.id,
        "name": p.name,
        "slug": p.slug,
        "brand": p.brand,
        "gender": p.gender,
        "is_hit": p.is_hit,
        "discount_percent": p.discount_percent,
        "min_price": min(prices) if prices else None,
        "max_price": max(prices) if prices else None,
        "variants": p.variants,
    }


def list_products_public(
    db: Session,
    brand_ids: Optional[list[int]],
    country_ids: Optional[list[int]],
    gender: Optional[str],
    price_min: Optional[Decimal],
    price_max: Optional[Decimal],
    is_hit: Optional[bool],
    search: Optional[str],
    page: int,
    limit: int,
) -> dict:
    q = (
        db.query(models.Product)
        .options(
            joinedload(models.Product.brand).joinedload(models.Brand.country),
            joinedload(models.Product.variants),
        )
        .join(models.Brand)
        .filter(models.Product.is_active == True)
    )

    if brand_ids:
        q = q.filter(models.Product.brand_id.in_(brand_ids))
    if country_ids:
        q = q.filter(models.Brand.country_id.in_(country_ids))
    if gender:
        q = q.filter(models.Product.gender == gender)
    if is_hit is not None:
        q = q.filter(models.Product.is_hit == is_hit)
    if search:
        pattern = f"%{search}%"
        q = q.filter(
            or_(
                models.Product.name.ilike(pattern),
                models.Product.description.ilike(pattern),
                models.Brand.name.ilike(pattern),
            )
        )
    if price_min is not None or price_max is not None:
        # Filter by products that have at least one variant in the price range
        variant_sub = db.query(models.ProductVariant.product_id)
        if price_min is not None:
            variant_sub = variant_sub.filter(models.ProductVariant.price >= price_min)
        if price_max is not None:
            variant_sub = variant_sub.filter(models.ProductVariant.price <= price_max)
        q = q.filter(models.Product.id.in_(variant_sub))

    total = q.count()
    products = q.order_by(models.Product.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    items = [_build_product_list_item(p) for p in products]
    return {"total": total, "page": page, "limit": limit, "items": items}


def get_product_by_slug_public(db: Session, slug: str) -> Optional[models.Product]:
    return (
        db.query(models.Product)
        .options(
            joinedload(models.Product.brand).joinedload(models.Brand.country),
            joinedload(models.Product.variants),
        )
        .filter(models.Product.slug == slug, models.Product.is_active == True)
        .first()
    )


# --- Products (admin) ---

def list_products_admin(
    db: Session,
    search: Optional[str],
    page: int,
    limit: int,
) -> dict:
    q = (
        db.query(models.Product)
        .options(
            joinedload(models.Product.brand),
            joinedload(models.Product.variants),
        )
        .join(models.Brand)
    )

    if search:
        pattern = f"%{search}%"
        q = q.filter(
            or_(
                models.Product.name.ilike(pattern),
                models.Brand.name.ilike(pattern),
            )
        )

    total = q.count()
    products = q.order_by(models.Product.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    items = []
    for p in products:
        prices = [v.price for v in p.variants]
        items.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "brand": p.brand,
            "gender": p.gender,
            "is_hit": p.is_hit,
            "is_active": p.is_active,
            "discount_percent": p.discount_percent,
            "min_price": min(prices) if prices else None,
            "max_price": max(prices) if prices else None,
        })
    return {"total": total, "page": page, "limit": limit, "items": items}


def get_product_by_id_admin(db: Session, product_id: int) -> Optional[models.Product]:
    return (
        db.query(models.Product)
        .options(
            joinedload(models.Product.brand).joinedload(models.Brand.country),
            joinedload(models.Product.variants),
        )
        .filter(models.Product.id == product_id)
        .first()
    )


def create_product(db: Session, payload: schemas.ProductCreate) -> models.Product:
    product = models.Product(
        brand_id=payload.brand_id,
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        gender=payload.gender,
        is_hit=payload.is_hit,
        discount_percent=payload.discount_percent,
    )
    db.add(product)
    db.flush()  # get product.id

    for v in payload.variants:
        variant = models.ProductVariant(
            product_id=product.id,
            volume_ml=v.volume_ml,
            price=v.price,
            stock_quantity=v.stock_quantity,
        )
        db.add(variant)

    db.commit()
    db.refresh(product)
    return get_product_by_id_admin(db, product.id)


def update_product(db: Session, product_id: int, payload: schemas.ProductUpdate) -> Optional[models.Product]:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    return get_product_by_id_admin(db, product_id)


def deactivate_product(db: Session, product_id: int) -> Optional[models.Product]:
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None
    product.is_active = False
    db.commit()
    return get_product_by_id_admin(db, product_id)


# --- Internal ---

def get_variant_internal(db: Session, variant_id: int) -> Optional[dict]:
    variant = (
        db.query(models.ProductVariant)
        .options(
            joinedload(models.ProductVariant.product).joinedload(models.Product.brand)
        )
        .filter(models.ProductVariant.id == variant_id)
        .first()
    )
    if not variant:
        return None
    return {
        "id": variant.id,
        "product_id": variant.product_id,
        "volume_ml": variant.volume_ml,
        "price": variant.price,
        "stock_quantity": variant.stock_quantity,
        "product_name": variant.product.name,
        "brand_name": variant.product.brand.name,
    }


def reserve_variants(db: Session, items: list[schemas.ReserveItem]) -> None:
    """Atomically decrement stock. Raises ValueError with detail dict on insufficient stock."""
    # Lock rows for update
    variants = {}
    for item in items:
        v = (
            db.query(models.ProductVariant)
            .filter(models.ProductVariant.id == item.variant_id)
            .with_for_update()
            .first()
        )
        if v is None:
            db.rollback()
            raise ValueError({"detail": f"variant {item.variant_id} not found"})
        if v.stock_quantity < item.quantity:
            db.rollback()
            raise ValueError({
                "detail": "out_of_stock",
                "variant_id": item.variant_id,
                "available": v.stock_quantity,
                "requested": item.quantity,
            })
        variants[item.variant_id] = v

    for item in items:
        variants[item.variant_id].stock_quantity -= item.quantity

    db.commit()


def release_variants(db: Session, items: list[schemas.ReserveItem]) -> None:
    """Return reserved stock (increment)."""
    for item in items:
        v = (
            db.query(models.ProductVariant)
            .filter(models.ProductVariant.id == item.variant_id)
            .with_for_update()
            .first()
        )
        if v:
            v.stock_quantity += item.quantity
    db.commit()
