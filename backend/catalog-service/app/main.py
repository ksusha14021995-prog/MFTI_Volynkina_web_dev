from fastapi import FastAPI

from app.db import Base, engine
from app.routers import internal, public

Base.metadata.create_all(bind=engine)

app = FastAPI(title="catalog-service", version="1.0.0")

app.include_router(public.router)
app.include_router(internal.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "catalog-service"}
