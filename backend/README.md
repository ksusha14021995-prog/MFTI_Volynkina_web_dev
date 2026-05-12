# backend

Микросервисы для интернет-магазина «КОМНАТА 26»:

- **catalog-service** — товары, бренды, страны, варианты объёма (`catalog_db`)
- **orders-service** — корзины, заказы, точки самовывоза (`orders_db`)

ТЗ: [../docs/02-architecture.md](../docs/02-architecture.md), [../docs/05-database.md](../docs/05-database.md), [../docs/06-api/](../docs/06-api/).

Стек: FastAPI + SQLAlchemy + Pydantic v2, по одному Postgres 16 на сервис, healthcheck перед стартом приложения, креды в `.env`.

## Структура

```
backend/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── postman/               # Postman-коллекции
├── catalog-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── seed.py            # Сидинг брендов, стран, товаров
│   └── app/
│       ├── main.py
│       ├── db.py
│       ├── models.py      # Country, Brand, Product, ProductVariant
│       ├── schemas.py
│       ├── crud.py
│       └── routers/
│           ├── public.py   # GET /api/catalog/*
│           └── internal.py # /internal/variants/*
└── orders-service/
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── main.py
        ├── db.py
        ├── models.py      # PickupPoint, OrderStatus, Cart, CartItem, Order, OrderItem
        ├── schemas.py
        ├── crud.py
        └── routers/
            ├── cart.py     # /api/cart/*
            ├── orders.py   # /api/orders/*
            └── pickup.py   # /api/pickup-points
```

## Запуск

```powershell
cd backend
Copy-Item .env.example .env
docker compose up --build
```

После `healthy`-статусов БД поднимутся сервисы:

- catalog-service → http://localhost:8001/docs (Swagger)
- orders-service  → http://localhost:8002/docs
- catalog-db      → localhost:5435 (внешний порт)
- orders-db       → localhost:5434

Сидинг каталога (после первого запуска):

```powershell
docker exec catalog-service python seed.py
```

Проверить межсервисную связку orders → catalog:

```
GET http://localhost:8002/health/catalog
```
