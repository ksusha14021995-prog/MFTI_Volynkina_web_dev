from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.db import Base


class PickupPoint(Base):
    __tablename__ = "pickup_points"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String(500), nullable=False)
    city = Column(String(200), nullable=False)
    working_hours = Column(String(200), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    orders = relationship("Order", back_populates="pickup_point")


class OrderStatus(Base):
    __tablename__ = "order_statuses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), nullable=False, unique=True)
    name = Column(String(100), nullable=False)

    orders = relationship("Order", back_populates="status")


class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(200), nullable=False, index=True)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_variant_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime, nullable=False, server_default=func.now())

    cart = relationship("Cart", back_populates="items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), nullable=False, unique=True, index=True)
    session_id = Column(String(200), nullable=True, index=True)
    user_id = Column(Integer, nullable=True)
    pickup_point_id = Column(Integer, ForeignKey("pickup_points.id"), nullable=False)
    status_id = Column(Integer, ForeignKey("order_statuses.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    contact_name = Column(String(200), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    contact_email = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    pickup_point = relationship("PickupPoint", back_populates="orders")
    status = relationship("OrderStatus", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_variant_id = Column(Integer, nullable=False)
    product_name = Column(String(300), nullable=False)
    brand_name = Column(String(200), nullable=False)
    volume_ml = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
