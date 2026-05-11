---
date: 2026-05-11
tags: [api, postman]
status: active
---

# 06. API — Postman-коллекции

Описание REST API интернет-магазина парфюмерии на разлив «КОМНАТА 26» в формате Postman Collection v2.1.0. Все запросы идут через единый API Gateway, который маршрутизирует их на нужный микросервис. Подробности архитектуры — в `../02-architecture.md`.

## Коллекции

| Файл | Микросервис | Что покрывает |
|------|-------------|---------------|
| `catalog.postman_collection.json` | catalog-service | Публичный каталог покупателя (товары, бренды, страны) и админский CRUD над товарами/брендами |
| `orders.postman_collection.json` | orders-service | Авторизация покупателя по одноразовому коду, корзина (гостевая и авторизованная), оформление заказов, история, админская работа с заказами и точками самовывоза |
| `admin.postman_collection.json` | admin-service | Логин администратора по email+паролю, выдача и инвалидация JWT, управление учётками админов |

### Структура коллекций

Каждая коллекция разбита на папки-разделы. Внутри каждого запроса есть как минимум один успешный response-пример и хотя бы один пример ошибки (validation / unauthorized / forbidden / conflict). Все примеры — реалистичные JSON, без плейсхолдеров, чтобы коллекцию можно было сразу мокировать в Postman Mock Server.

## Как импортировать

1. Открыть Postman → кнопка **Import** в левом верхнем углу.
2. Перетащить все три `.json` файла или выбрать через **Choose files**.
3. После импорта в сайдбаре появятся три коллекции с префиксом «KOMNATA 26 —».
4. Развернуть коллекцию → раскрыть `Variables` → проверить, что `base_url` указывает на нужное окружение.

## Переменные окружения

В каждую коллекцию встроены collection-level переменные:

| Переменная | Назначение | Где задаётся |
|------------|------------|--------------|
| `base_url` | URL API Gateway (по умолчанию `https://api.komnata26.ru`) | На время локальной разработки — заменить на `http://localhost:8080` |
| `token` | Bearer JWT для запросов под авторизацией | Покупательский JWT — после `orders → Auth покупателя → Verify code`. Админский JWT — после `admin → Auth администратора → Login`. Скопировать `token` из response.body и вставить в переменную коллекции |

Покупатель и админ используют **разные** токены — между коллекциями переменная `token` не шарится. Можно положить оба в Environment (например, `customer_token` и `admin_token`) и переопределить ссылки в запросах.

## Связь с микросервисами

```
Customer SPA / Admin SPA
        │
        ▼
   API Gateway (https://api.komnata26.ru)
        │
        ├── /api/catalog/*, /api/admin/catalog/*   →  catalog-service
        ├── /api/auth/customer/*, /api/cart/*,
        │   /api/orders/*, /api/pickup-points/*,
        │   /api/admin/orders/*,
        │   /api/admin/pickup-points/*             →  orders-service
        └── /api/admin/auth/*, /api/admin/users/*  →  admin-service
```

Gateway валидирует JWT и проверяет роль (`customer` / `admin`) **до** проксирования запроса вниз. Эндпоинты с префиксом `/api/admin/*` доступны только при `role=admin`; `/api/cart`, `/api/orders` — для `role=customer` (или гостя через `X-Session-Id` там, где это допустимо).

## Соглашения

- Все запросы и ответы — `application/json; charset=utf-8`.
- Ошибки имеют единый формат:
  ```json
  { "error": { "code": "ERROR_CODE", "message": "Текст для пользователя", "fields": { } } }
  ```
- Идентификаторы — числовые BIGINT (`id`, `product_variant_id` и т.д.), номера заказов — строковые `K26-YYYY-NNNNN`.
- Коды ответов:
  - `200 OK` — успешные GET / PATCH / POST-actions
  - `201 Created` — успешный POST с созданием ресурса
  - `204 No Content` — успешный DELETE / Logout
  - `400 Bad Request` — ошибка валидации тела/query
  - `401 Unauthorized` — нет токена или просрочен
  - `403 Forbidden` — токен валиден, но роли не хватает
  - `404 Not Found` — ресурс не найден
  - `409 Conflict` — конфликт состояния (нехватка остатков, недопустимый переход статуса, дубликат)
