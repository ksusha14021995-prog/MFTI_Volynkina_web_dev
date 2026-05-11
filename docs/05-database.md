---
date: 2026-05-11
tags: [database, er-diagram]
status: active
---

# 05. База данных

ER-диаграмма данных интернет-магазина «КОМНАТА 26». Архитектура разделена на три микросервиса с независимыми БД: `auth_db` (пользователи, сессии, OTP-коды), `catalog_db` (товары и каталожные справочники) и `orders_db` (корзины, заказы, точки самовывоза). Межсервисные ссылки на `user_id` и `product_variant_id` — логические, физических FK между БД нет.

```mermaid
erDiagram

    %% ============================================================
    %% auth_db — пользователи и аутентификация
    %% ============================================================

    users {
        int id PK
        string email
        string phone
        string password_hash
        string full_name
        string role
        bool is_active
        datetime created_at
        datetime updated_at
    }

    sessions {
        int id PK
        int user_id FK
        string token_hash
        datetime expires_at
        string ip_address
        datetime created_at
    }

    otp_codes {
        int id PK
        string identifier
        string code_hash
        datetime expires_at
        datetime used_at
        datetime created_at
    }

    users ||--o{ sessions : "сессии пользователя"

    %% ============================================================
    %% catalog_db — каталог
    %% ============================================================

    countries {
        int id PK
        string name
        string code
    }

    brands {
        int id PK
        string name
        int country_id FK
        string slug
    }

    products {
        int id PK
        int brand_id FK
        string name
        string slug
        string description
        bool is_active
        bool is_hit
        int discount_percent
        string gender
        datetime created_at
        datetime updated_at
    }

    product_variants {
        int id PK
        int product_id FK
        int volume_ml
        decimal price
        int stock_quantity
    }

    countries ||--o{ brands : "страна бренда"
    brands ||--o{ products : "бренд товара"
    products ||--o{ product_variants : "варианты объёма"

    %% ============================================================
    %% orders_db — заказы и корзины
    %% ============================================================

    pickup_points {
        int id PK
        string address
        string city
        string working_hours
        bool is_active
    }

    order_statuses {
        int id PK
        string code
        string name
    }

    carts {
        int id PK
        string session_id
        int user_id
        datetime created_at
        datetime updated_at
    }

    cart_items {
        int id PK
        int cart_id FK
        int product_variant_id
        int quantity
        datetime added_at
    }

    orders {
        int id PK
        string order_number
        int user_id
        int pickup_point_id FK
        int status_id FK
        decimal total_amount
        string contact_name
        string contact_phone
        string contact_email
        datetime created_at
        datetime updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_variant_id
        string product_name
        string brand_name
        int volume_ml
        int quantity
        decimal unit_price
        decimal subtotal
    }

    carts ||--o{ cart_items : "позиции корзины"
    pickup_points ||--o{ orders : "точка самовывоза"
    order_statuses ||--o{ orders : "статус заказа"
    orders ||--o{ order_items : "позиции заказа"
```

> Логические межсервисные ссылки (без физических FK): `carts.user_id` и `orders.user_id` → `auth_db.users.id`; `cart_items.product_variant_id` и `order_items.product_variant_id` → `catalog_db.product_variants.id`. Поля `order_items.product_name`, `brand_name`, `volume_ml`, `unit_price` — снапшот товара на момент оформления заказа.

## Легенда: распределение таблиц по сервисам

| Сущность            | Сервис       |
|---------------------|--------------|
| `users`             | auth_db      |
| `sessions`          | auth_db      |
| `otp_codes`         | auth_db      |
| `countries`         | catalog_db   |
| `brands`            | catalog_db   |
| `products`          | catalog_db   |
| `product_variants`  | catalog_db   |
| `pickup_points`     | orders_db    |
| `order_statuses`    | orders_db    |
| `carts`             | orders_db    |
| `cart_items`        | orders_db    |
| `orders`            | orders_db    |
| `order_items`       | orders_db    |
