from pydantic import BaseModel, ConfigDict


class ItemCreate(BaseModel):
    name: str


class ItemRead(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
