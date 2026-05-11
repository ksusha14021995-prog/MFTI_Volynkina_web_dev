# backend

Микросервисы для интернет-магазина «КОМНАТА 26»:

- **catalog-service** — товары, бренды, страны, варианты объёма (`catalog_db`)
- **orders-service** — корзины, заказы, точки самовывоза (`orders_db`)

ТЗ, по которому реализуется: [../docs/02-architecture.md](../docs/02-architecture.md), [../docs/05-database.md](../docs/05-database.md), [../docs/06-api/](../docs/06-api/).

Скелет собран по паттерну семинаров модуля 2 Нетологии: FastAPI + SQLAlchemy + Pydantic, по одному Postgres-контейнеру на сервис, healthcheck перед стартом приложения, креды в `.env`. Сейчас в каждом сервисе лежит заглушка `items` из семинара — далее заменим на реальные модели по ТЗ.

## Структура

```
backend/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── catalog-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py     # FastAPI app + endpoints
│       ├── db.py       # SQLAlchemy engine / session / Base
│       ├── models.py   # ORM-модели (пока заглушка Item)
│       ├── schemas.py  # Pydantic-схемы
│       └── crud.py     # бизнес-логика над БД
└── orders-service/     # та же структура + httpx для вызова catalog
```

## Запуск

```powershell
cd backend
Copy-Item .env.example .env
docker compose up --build
```

После `healthy`-статусов БД поднимутся сервисы:

- catalog-service → http://localhost:8001/docs (Swagger)
- orders-service → http://localhost:8002/docs
- catalog-db → localhost:5433 (внешний порт)
- orders-db → localhost:5434

Проверить связку orders → catalog:

```
GET http://localhost:8002/health/catalog
```

## План доработки

См. [vault/.../module2-materials/DZ_M2_Plan.md](../../module2-materials/DZ_M2_Plan.md). Ключевые шаги:

1. Подключить Alembic в каждом сервисе.
2. Заменить заглушку `Item` на реальные модели: catalog (countries / brands / products / product_variants) и orders (carts / cart_items / pickup_points / order_statuses / orders / order_items).
3. Реализовать публичные и админские эндпоинты согласно Postman-коллекциям из ТЗ.
4. Внутренние эндпоинты catalog: `/internal/variants/{id}`, `/internal/variants/reserve`, `/internal/variants/release`.
5. Сидинг catalog: бренды Tom Ford, YSL, Maison Margiela, Creed, Byredo, Le Labo, Amouage и по 2–3 товара на бренд.
6. Запись видео-демо Postman и сдача в форму Нетологии.

## Локальный dev без Docker

Postgres всё равно стоит поднять через `docker compose up catalog-db orders-db`. Затем установить зависимости в общий `study/.venv`:

```powershell
.venv\Scripts\pip.exe install -r vault\projects\netology-web-2sem\MFTI_Volynkina_web_dev\backend\catalog-service\requirements.txt
.venv\Scripts\pip.exe install -r vault\projects\netology-web-2sem\MFTI_Volynkina_web_dev\backend\orders-service\requirements.txt
```

Запустить сервис:

```powershell
$env:POSTGRES_USER="catalog"; $env:POSTGRES_PASSWORD="catalog_pw_change_me"; `
$env:POSTGRES_DB="catalog"; $env:POSTGRES_HOST="localhost"; $env:POSTGRES_PORT="5433"
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001 `
  --app-dir vault\projects\netology-web-2sem\MFTI_Volynkina_web_dev\backend\catalog-service
```
