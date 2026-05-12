from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


# --- Pickup Points ---

class PickupPointRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    address: str
    city: str
    working_hours: str
    is_active: bool


class PickupPointCreate(BaseModel):
    address: str
    city: str
    working_hours: str
    is_active: bool = True


class PickupPointUpdate(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    working_hours: Optional[str] = None
    is_active: Optional[bool] = None


# --- Cart ---

class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_variant_id: int
    quantity: int
    added_at: datetime


class CartRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: str
    items: list[CartItemRead]


class AddCartItemRequest(BaseModel):
    product_variant_id: int
    quantity: int = 1


class UpdateCartItemRequest(BaseModel):
    quantity: int


# --- Orders ---

class OrderStatusRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_variant_id: int
    product_name: str
    brand_name: str
    volume_ml: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    total_amount: Decimal
    contact_name: str
    contact_phone: str
    contact_email: str
    created_at: datetime
    updated_at: datetime
    status: OrderStatusRead
    pickup_point: PickupPointRead
    items: list[OrderItemRead]


class OrderListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    total_amount: Decimal
    contact_name: str
    contact_phone: str
    contact_email: str
    created_at: datetime
    status: OrderStatusRead
    pickup_point: PickupPointRead


class OrderListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[OrderListItem]


class CreateOrderRequest(BaseModel):
    pickup_point_id: int
    contact_name: str
    contact_phone: str
    contact_email: str


class UpdateOrderStatusRequest(BaseModel):
    status: str


class UpdatePickupPointRequest(BaseModel):
    pickup_point_id: int
