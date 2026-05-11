---
date: 2026-05-11
tags: [requirements, pages, roles]
status: active
---

# 03. Страницы и роли

Сводная матрица «страница × роль» для интернет-магазина «КОМНАТА 26». Цель — на одной странице показать, какие действия доступны каждой роли (Гость, зарегистрированный Покупатель, Админ) на каждом из 14 экранов прототипа.

| № | Страница | Гость | Покупатель | Админ |
|---|----------|-------|------------|-------|
| 1 | [catalog.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/catalog.html) | Просмотр, поиск, фильтры, переход в карточку | То же + корзина привязана к аккаунту | 👁 просмотр (как гость) |
| 2 | [product.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/product.html) | Просмотр, выбор объёма, «В корзину» | То же | 👁 просмотр (как гость) |
| 3 | [cart.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/cart.html) | Изменить количество, удалить позицию, очистить, перейти к оформлению | То же + корзина сохраняется в аккаунте | 👁 просмотр (как гость) |
| 4 | [checkout.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/checkout.html) | Ввести имя/телефон/email, выбрать точку самовывоза, оформить | То же + поля предзаполнены из профиля | 👁 просмотр (как гость) |
| 5 | [order-confirmed.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/order-confirmed.html) | Просмотр номера заказа, состава, точки выдачи | То же + заказ виден в истории ЛК | 👁 просмотр (как гость) |
| 6 | [login.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/login.html) | Запросить код на email/телефон, войти | Уже авторизован, редирект в ЛК | — |
| 7 | [account-orders.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-orders.html) | — | История заказов, фильтр по статусу, переход в детали | — |
| 8 | [account-order.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-order.html) | — | Просмотр деталей, отмена заказа (до «Готов к выдаче») | — |
| 9 | [account-profile.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-profile.html) | — | Редактирование имени, телефона, email | — |
| 10 | [admin-login.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-login.html) | — | — | Вход по email + паролю |
| 11 | [admin-products.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-products.html) | — | — | Список товаров, поиск, фильтры, создать товар |
| 12 | [admin-product-form.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-product-form.html) | — | — | Создать/редактировать товар, варианты объёмов, цены, остатки, активность |
| 13 | [admin-orders.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-orders.html) | — | — | Список заказов, поиск по номеру/клиенту, фильтр по статусу |
| 14 | [admin-order.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-order.html) | — | — | Просмотр деталей заказа, смена статуса |

## Комментарии

- **Админка (экраны 10–14) полностью недоступна** Гостю и Покупателю: отдельный URL, отдельная авторизация по email + паролю. С покупательских страниц туда нет ни ссылок, ни редиректов.
- **Личный кабинет (экраны 7–9) доступен только зарегистрированному Покупателю.** Гость, кликнувший по иконке ЛК в шапке, попадает на `login.html`.
- **Админ на покупательском сайте действует как Гость:** может зайти и протестировать каталог, корзину, оформление, но это отдельная сессия от админской — отдельных «админских» возможностей в покупательском UI не предусмотрено.
- **Корзина гостя (экран 3) переносится в аккаунт** при логине — это техническая склейка, для UI таблицы она выглядит одинаково для обеих ролей.
- **Checkout (экран 4) для Покупателя** отличается только предзаполнением полей из профиля; набор действий тот же, что у Гостя.
- **Login (экран 6) не имеет смысла для уже авторизованного Покупателя** — в реальном UI с этого экрана идёт редирект в ЛК; для Админа экран не релевантен, у него свой `admin-login.html`.
