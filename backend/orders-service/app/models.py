from sqlalchemy import Column, Integer, String

from app.db import Base


class Item(Base):
    """Заглушка из семинара. Будет заменена на carts / cart_items / orders / order_items / pickup_points / order_statuses."""

    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
