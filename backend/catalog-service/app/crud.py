from sqlalchemy.orm import Session

from app import models, schemas


def create_item(db: Session, payload: schemas.ItemCreate) -> models.Item:
    item = models.Item(name=payload.name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session) -> list[models.Item]:
    return db.query(models.Item).order_by(models.Item.id).all()
