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


class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)

    brands = relationship("Brand", back_populates="country")


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    slug = Column(String(200), nullable=False, unique=True)

    country = relationship("Country", back_populates="brands")
    products = relationship("Product", back_populates="brand")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    name = Column(String(300), nullable=False)
    slug = Column(String(300), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_hit = Column(Boolean, nullable=False, default=False)
    discount_percent = Column(Integer, nullable=False, default=0)
    gender = Column(String(20), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    brand = relationship("Brand", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    volume_ml = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)

    product = relationship("Product", back_populates="variants")
