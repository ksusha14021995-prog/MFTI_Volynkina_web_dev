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
| `auth.postman_collection.json` | auth-service | Вход покупателя по одноразовому коду (email/телефон), вход администратора по email+паролю, общие сессионные эндпоинты (`/me`, `/logout`), профиль покупателя, управление учётками администраторов |
| `catalog.postman_collection.json` | catalog-service | Публичный каталог покупателя (товары, бренды, страны) и админский CRUD над товарами и брендами |
| `orders.postman_collection.json` | orders-service | Корзина (гостевая через `X-Session-Id` и авторизованная), оформление заказов, история заказов покупателя, админская работа с заказами и точками самовывоза |

### Структура коллекций

Каждая коллекция разбита на папки-разделы. Внутри каждого запроса есть как минимум один успешный response-пример и хотя бы один пример ошибки (validation / unauthorized / forbidden / conflict / rate-limited). Все примеры — реалистичные JSON, без плейсхолдеров, чтобы коллекцию можно было сразу мокировать в Postman Mock Server.

## Как импортировать

1. Открыть Postman → кнопка **Import** в левом верхнем углу.
2. Перетащить все три `.json` файла или выбрать через **Choose files**.
3. После импорта в сайдбаре появятся три коллекции с префиксом «KOMNATA 26 —».
4. Развернуть коллекцию → раскрыть `Variables` → проверить, что `base_url` указывает на нужное окружение.

## Переменные окружения

В каждую коллекцию встроены collection-level переменные. Чтобы один и тот же токен использовать сразу в трёх коллекциях, удобно вынести `customer_token` и `admin_token` в Environment.

| Переменная | Назначение | Где задаётся |
|------------|------------|--------------|
| `base_url` | URL API Gateway (по умолчанию `https://api.komnata26.ru`) | На время локальной разработки — заменить на `http://localhost:8080` |
| `customer_token` | Bearer JWT покупателя (role=customer) | Получить через `auth → Customer auth → Verify code`. Скопировать `token` из response.body и вставить в переменную |
| `admin_token` | Bearer JWT администратора (role=admin) | Получить через `auth → Admin auth → Login`. Скопировать `token` из response.body и вставить в переменную |

В коллекции `catalog` для админских эндпоинтов используется одна переменная `token` — туда нужно класть значение `admin_token`. Это упрощает single-collection тесты; при работе через Environment удобнее переопределить header на `Bearer {{admin_token}}`.

## Связь с микросервисами

```
Сайт покупателя / Админка
        │
        ▼
   API Gateway (https://api.komnata26.ru)
        │
        ├── /api/auth/*                            →  auth-service
        ├── /api/catalog/*, /api/admin/catalog/*   →  catalog-service
        └── /api/cart/*, /api/orders/*,
            /api/pickup-points/*,
            /api/admin/orders/*,
            /api/admin/pickup-points/*             →  orders-service
```

Gateway валидирует JWT и проверяет роль (`customer` / `admin`) **до** проксирования запроса вниз. Эндпоинты с префиксом `/api/admin/*` (включая `/api/auth/admin/users`) доступны только при `role=admin`; `/api/cart`, `/api/orders` — для `role=customer` (или гостя через `X-Session-Id` там, где это допустимо).

Пользовательские учётки — единая таблица `auth_db.users`. Поле `role` (`customer` | `admin`) определяет, какой вход разрешён (одноразовый код или email+пароль) и какие эндпоинты доступны. Заказы в `orders_db.orders` ссылаются на пользователя через `user_id` (FK на `auth_db.users.id`); для гостевых заказов `user_id` равен NULL, контакты берутся из тела запроса.

## Соглашения

- Все запросы и ответы — `application/json; charset=utf-8`.
- Ошибки имеют единый формат:
  ```json
  { "error": { "code": "ERROR_CODE", "message": "Текст для пользователя", "fields": { } } }
  ```
- Идентификаторы — числовые BIGINT (`id`, `product_variant_id`, `user_id` и т.д.), номера заказов — строковые `K26-YYYY-NNNNN`.
- Коды ответов:
  - `200 OK` — успешные GET / PATCH / POST-actions
  - `201 Created` — успешный POST с созданием ресурса
  - `204 No Content` — успешный DELETE / Logout
  - `400 Bad Request` — ошибка валидации тела/query
  - `401 Unauthorized` — нет токена или просрочен
  - `403 Forbidden` — токен валиден, но роли не хватает
  - `404 Not Found` — ресурс не найден
  - `409 Conflict` — конфликт состояния (нехватка остатков, недопустимый переход статуса, дубликат)
  - `429 Too Many Requests` — превышен лимит (например, на запрос одноразового кода)
