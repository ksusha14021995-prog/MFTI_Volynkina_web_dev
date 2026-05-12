from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, model_validator


# --- Country ---

class CountryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    code: str


# --- Brand ---

class BrandRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    country: CountryRead


class BrandCreate(BaseModel):
    name: str
    slug: str
    country_id: int


# --- Product Variant ---

class VariantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    volume_ml: int
    price: Decimal
    stock_quantity: int


class VariantCreate(BaseModel):
    volume_ml: int
    price: Decimal
    stock_quantity: int = 0


# --- Product (public listing) ---

class BrandBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class ProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    brand: BrandBrief
    gender: Optional[str]
    is_hit: bool
    discount_percent: int
    min_price: Optional[Decimal]
    max_price: Optional[Decimal]
    variants: list[VariantRead]
    image_url: Optional[str] = None

    @model_validator(mode="after")
    def set_image_url(self) -> "ProductListItem":
        if not self.image_url:
            self.image_url = f"/static/images/{self.slug}.jpg"
        return self


class ProductListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[ProductListItem]


# --- Product (full card) ---

class BrandWithCountry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    country: CountryRead


class ProductDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str]
    is_active: bool
    is_hit: bool
    discount_percent: int
    gender: Optional[str]
    created_at: datetime
    updated_at: datetime
    brand: BrandWithCountry
    variants: list[VariantRead]
    image_url: Optional[str] = None

    @model_validator(mode="after")
    def set_image_url(self) -> "ProductDetail":
        if not self.image_url:
            self.image_url = f"/static/images/{self.slug}.jpg"
        return self


# --- Product create/update ---

class ProductCreate(BaseModel):
    brand_id: int
    name: str
    slug: str
    description: Optional[str] = None
    gender: Optional[str] = None
    is_hit: bool = False
    discount_percent: int = 0
    variants: list[VariantCreate] = []


class ProductUpdate(BaseModel):
    brand_id: Optional[int] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    gender: Optional[str] = None
    is_hit: Optional[bool] = None
    discount_percent: Optional[int] = None
    is_active: Optional[bool] = None


# --- Admin product listing ---

class AdminProductListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    brand: BrandBrief
    gender: Optional[str]
    is_hit: bool
    is_active: bool
    discount_percent: int
    min_price: Optional[Decimal]
    max_price: Optional[Decimal]


class AdminProductListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[AdminProductListItem]


# --- Internal endpoints ---

class InternalVariantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    volume_ml: int
    price: Decimal
    stock_quantity: int
    product_name: str
    brand_name: str


class ReserveItem(BaseModel):
    variant_id: int
    quantity: int


class ReserveRequest(BaseModel):
    items: list[ReserveItem]
