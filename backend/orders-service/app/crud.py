import random
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app import models, schemas


# --- Seed helpers ---

def seed_statuses(db: Session) -> None:
    if db.query(models.OrderStatus).count() > 0:
        return
    statuses = [
        models.OrderStatus(code="assembly", name="Сборка"),
        models.OrderStatus(code="ready", name="Готов к выдаче"),
        models.OrderStatus(code="issued", name="Выдан"),
        models.OrderStatus(code="cancelled", name="Отменён"),
    ]
    db.add_all(statuses)
    db.commit()


def seed_pickup_points(db: Session) -> None:
    if db.query(models.PickupPoint).count() > 0:
        return
    points = [
        models.PickupPoint(
            address="Арбат, 10",
            city="Москва",
            working_hours="пн-вс 10:00-21:00",
            is_active=True,
        ),
        models.PickupPoint(
            address="Мясницкая, 5",
            city="Москва",
            working_hours="пн-вс 10:00-21:00",
            is_active=True,
        ),
        models.PickupPoint(
            address="Таганская, 1",
            city="Москва",
            working_hours="пн-вс 11:00-20:00",
            is_active=True,
        ),
    ]
    db.add_all(points)
    db.commit()


# --- Pickup Points ---

def get_active_pickup_points(db: Session) -> list[models.PickupPoint]:
    return db.query(models.PickupPoint).filter(models.PickupPoint.is_active == True).all()


def get_all_pickup_points(db: Session) -> list[models.PickupPoint]:
    return db.query(models.PickupPoint).all()


def get_pickup_point_by_id(db: Session, point_id: int) -> Optional[models.PickupPoint]:
    return db.query(models.PickupPoint).filter(models.PickupPoint.id == point_id).first()


def create_pickup_point(db: Session, payload: schemas.PickupPointCreate) -> models.PickupPoint:
    point = models.PickupPoint(**payload.model_dump())
    db.add(point)
    db.commit()
    db.refresh(point)
    return point


def update_pickup_point(db: Session, point_id: int, payload: schemas.PickupPointUpdate) -> Optional[models.PickupPoint]:
    point = get_pickup_point_by_id(db, point_id)
    if not point:
        return None
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(point, key, value)
    db.commit()
    db.refresh(point)
    return point


# --- Cart ---

def get_or_create_cart(db: Session, session_id: str) -> models.Cart:
    cart = (
        db.query(models.Cart)
        .options(joinedload(models.Cart.items))
        .filter(models.Cart.session_id == session_id)
        .first()
    )
    if not cart:
        cart = models.Cart(session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def add_cart_item(db: Session, session_id: str, payload: schemas.AddCartItemRequest) -> models.Cart:
    cart = get_or_create_cart(db, session_id)
    existing = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.cart_id == cart.id,
            models.CartItem.product_variant_id == payload.product_variant_id,
        )
        .first()
    )
    if existing:
        existing.quantity += payload.quantity
    else:
        item = models.CartItem(
            cart_id=cart.id,
            product_variant_id=payload.product_variant_id,
            quantity=payload.quantity,
        )
        db.add(item)
    db.commit()
    return (
        db.query(models.Cart)
        .options(joinedload(models.Cart.items))
        .filter(models.Cart.id == cart.id)
        .first()
    )


def update_cart_item(db: Session, session_id: str, item_id: int, quantity: int) -> Optional[models.Cart]:
    cart = (
        db.query(models.Cart)
        .options(joinedload(models.Cart.items))
        .filter(models.Cart.session_id == session_id)
        .first()
    )
    if not cart:
        return None
    item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.id)
        .first()
    )
    if not item:
        return None
    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity
    db.commit()
    return (
        db.query(models.Cart)
        .options(joinedload(models.Cart.items))
        .filter(models.Cart.id == cart.id)
        .first()
    )


def delete_cart_item(db: Session, session_id: str, item_id: int) -> bool:
    cart = db.query(models.Cart).filter(models.Cart.session_id == session_id).first()
    if not cart:
        return False
    item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart.id)
        .first()
    )
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


def clear_cart(db: Session, session_id: str) -> bool:
    cart = db.query(models.Cart).filter(models.Cart.session_id == session_id).first()
    if not cart:
        return False
    db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
    db.commit()
    return True


# --- Orders ---

def _generate_order_number() -> str:
    today = date.today().strftime("%Y%m%d")
    rand = random.randint(100000, 999999)
    return f"RM-{today}-{rand}"


def _get_status_by_code(db: Session, code: str) -> Optional[models.OrderStatus]:
    return db.query(models.OrderStatus).filter(models.OrderStatus.code == code).first()


def _load_order(db: Session, order_number: str) -> Optional[models.Order]:
    return (
        db.query(models.Order)
        .options(
            joinedload(models.Order.status),
            joinedload(models.Order.pickup_point),
            joinedload(models.Order.items),
        )
        .filter(models.Order.order_number == order_number)
        .first()
    )


def create_order(
    db: Session,
    session_id: str,
    payload: schemas.CreateOrderRequest,
    variant_infos: dict,  # variant_id -> {price, product_name, brand_name, volume_ml}
) -> models.Order:
    """Create order from cart. variant_infos must be pre-fetched from catalog-service."""
    cart = (
        db.query(models.Cart)
        .options(joinedload(models.Cart.items))
        .filter(models.Cart.session_id == session_id)
        .first()
    )

    assembly_status = _get_status_by_code(db, "assembly")

    total = Decimal("0.00")
    order_items = []
    for ci in cart.items:
        info = variant_infos[ci.product_variant_id]
        unit_price = Decimal(str(info["price"]))
        subtotal = unit_price * ci.quantity
        total += subtotal
        order_items.append({
            "product_variant_id": ci.product_variant_id,
            "product_name": info["product_name"],
            "brand_name": info["brand_name"],
            "volume_ml": info["volume_ml"],
            "quantity": ci.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal,
        })

    order = models.Order(
        order_number=_generate_order_number(),
        session_id=session_id,
        pickup_point_id=payload.pickup_point_id,
        status_id=assembly_status.id,
        total_amount=total,
        contact_name=payload.contact_name,
        contact_phone=payload.contact_phone,
        contact_email=payload.contact_email,
    )
    db.add(order)
    db.flush()

    for item_data in order_items:
        db.add(models.OrderItem(order_id=order.id, **item_data))

    # Clear cart items
    db.query(models.CartItem).filter(models.CartItem.cart_id == cart.id).delete()
    db.commit()

    return _load_order(db, order.order_number)


def list_orders_by_session_or_email(db: Session, session_id: str, email: Optional[str]) -> list[models.Order]:
    q = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.status),
            joinedload(models.Order.pickup_point),
            joinedload(models.Order.items),
        )
    )
    if email:
        q = q.filter(models.Order.contact_email == email)
    else:
        q = q.filter(models.Order.session_id == session_id)
    return q.order_by(models.Order.created_at.desc()).all()


def get_order_by_number(db: Session, order_number: str) -> Optional[models.Order]:
    return _load_order(db, order_number)


def cancel_order(db: Session, order_number: str) -> Optional[models.Order]:
    order = db.query(models.Order).filter(models.Order.order_number == order_number).first()
    if not order:
        return None
    cancelled_status = _get_status_by_code(db, "cancelled")
    order.status_id = cancelled_status.id
    db.commit()
    return _load_order(db, order_number)


# --- Admin Orders ---

VALID_TRANSITIONS = {
    "assembly": ["ready", "cancelled"],
    "ready": ["issued", "cancelled"],
    "issued": [],
    "cancelled": [],
}


def list_orders_admin(
    db: Session,
    status: Optional[str],
    customer_email: Optional[str],
    customer_phone: Optional[str],
    order_number_filter: Optional[str],
    date_from: Optional[str],
    date_to: Optional[str],
    page: int,
    limit: int,
) -> dict:
    q = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.status),
            joinedload(models.Order.pickup_point),
            joinedload(models.Order.items),
        )
        .join(models.OrderStatus)
    )

    if status:
        q = q.filter(models.OrderStatus.code == status)
    if customer_email:
        q = q.filter(models.Order.contact_email.ilike(f"%{customer_email}%"))
    if customer_phone:
        q = q.filter(models.Order.contact_phone.ilike(f"%{customer_phone}%"))
    if order_number_filter:
        q = q.filter(models.Order.order_number.ilike(f"%{order_number_filter}%"))
    if date_from:
        q = q.filter(models.Order.created_at >= date_from)
    if date_to:
        q = q.filter(models.Order.created_at <= date_to)

    total = q.count()
    orders = q.order_by(models.Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "page": page, "limit": limit, "items": orders}


def update_order_status(db: Session, order_number: str, new_status_code: str) -> Optional[models.Order]:
    order = (
        db.query(models.Order)
        .options(joinedload(models.Order.status))
        .filter(models.Order.order_number == order_number)
        .first()
    )
    if not order:
        return None
    current_code = order.status.code
    allowed = VALID_TRANSITIONS.get(current_code, [])
    if new_status_code not in allowed:
        raise ValueError(f"Transition {current_code} → {new_status_code} not allowed. Allowed: {allowed}")
    new_status = _get_status_by_code(db, new_status_code)
    if not new_status:
        raise ValueError(f"Status code '{new_status_code}' not found")
    order.status_id = new_status.id
    db.commit()
    return _load_order(db, order_number)


def delete_order_item(db: Session, order_number: str, item_id: int) -> Optional[models.Order]:
    order = (
        db.query(models.Order)
        .options(joinedload(models.Order.status), joinedload(models.Order.items))
        .filter(models.Order.order_number == order_number)
        .first()
    )
    if not order:
        return None
    item = db.query(models.OrderItem).filter(
        models.OrderItem.id == item_id,
        models.OrderItem.order_id == order.id,
    ).first()
    if not item:
        return None

    order.total_amount = Decimal(str(order.total_amount)) - Decimal(str(item.subtotal))
    db.delete(item)
    db.commit()
    return _load_order(db, order_number)


def update_order_pickup_point(db: Session, order_number: str, pickup_point_id: int) -> Optional[models.Order]:
    order = db.query(models.Order).filter(models.Order.order_number == order_number).first()
    if not order:
        return None
    order.pickup_point_id = pickup_point_id
    db.commit()
    return _load_order(db, order_number)
