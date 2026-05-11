---
date: 2026-05-11
tags: [database, er-diagram]
status: active
---

# 05. База данных

ER-диаграмма данных интернет-магазина «КОМНАТА 26». Архитектура разделена на три микросервиса с независимыми БД: `catalog_db` (товары и каталожные справочники), `orders_db` (корзины, заказы, покупатели, точки самовывоза) и `admin_db` (администраторы и их сессии). Межсервисные ссылки на `product_variant_id` — логические, без физических FK; критичные поля товара сохраняются снапшотом в `order_items`.

```mermaid
erDiagram

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

    customers {
        int id PK
        string email
        string phone
        string name
        datetime created_at
    }

    carts {
        int id PK
        string session_id
        int customer_id FK
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

    orders {
        int id PK
        string order_number
        int customer_id FK
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

    customers ||--o{ carts : "корзина покупателя"
    carts ||--o{ cart_items : "позиции корзины"
    customers ||--o{ orders : "заказы покупателя"
    pickup_points ||--o{ orders : "точка самовывоза"
    order_statuses ||--o{ orders : "статус заказа"
    orders ||--o{ order_items : "позиции заказа"

    %% ============================================================
    %% admin_db — администраторы
    %% ============================================================

    admin_users {
        int id PK
        string email
        string password_hash
        string full_name
        bool is_active
        datetime created_at
    }

    admin_sessions {
        int id PK
        int admin_user_id FK
        string token_hash
        datetime created_at
        datetime expires_at
        string ip_address
    }

    admin_users ||--o{ admin_sessions : "сессии админа"
```

## Легенда: распределение таблиц по сервисам

| Сущность            | Сервис      |
|---------------------|-------------|
| `countries`         | catalog_db  |
| `brands`            | catalog_db  |
| `products`          | catalog_db  |
| `product_variants`  | catalog_db  |
| `customers`         | orders_db   |
| `carts`             | orders_db   |
| `cart_items`        | orders_db   |
| `pickup_points`     | orders_db   |
| `order_statuses`    | orders_db   |
| `orders`            | orders_db   |
| `order_items`       | orders_db   |
| `admin_users`       | admin_db    |
| `admin_sessions`    | admin_db    |
