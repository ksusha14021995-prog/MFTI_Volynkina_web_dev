# 04. Прототипы интерфейсов

Адаптивные прототипы всех страниц интернет-магазина «КОМНАТА 26» — покупательской части и админ-панели.

## Хостинг

Прототипы развёрнуты на GitHub Pages и открываются как обычный сайт:

🔗 **https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/**

Главная страница содержит ссылки на все 14 экранов и работает как навигационный хаб. Все ссылки между страницами тоже кликабельные — можно пройти полный user flow от каталога до подтверждения заказа.

## Список экранов

### Покупатель (9 экранов)
1. **Каталог** — `catalog.html`
2. **Карточка товара** — `product.html`
3. **Корзина** — `cart.html`
4. **Оформление заказа** — `checkout.html`
5. **Подтверждение заказа** — `order-confirmed.html`
6. **Вход / регистрация** — `login.html`
7. **ЛК: история заказов** — `account-orders.html`
8. **ЛК: детали заказа** — `account-order.html`
9. **ЛК: профиль** — `account-profile.html`

### Админка (5 экранов)
10. **Вход в админку** — `admin-login.html`
11. **Список товаров** — `admin-products.html`
12. **Карточка товара (редактирование)** — `admin-product-form.html`
13. **Список заказов** — `admin-orders.html`
14. **Карточка заказа** — `admin-order.html`

## Импорт в Figma

Прототипы написаны на чистом HTML и переносятся в Figma через бесплатный плагин **html.to.design**.

### Шаги:

1. Открой Figma Desktop (плагины работают только в десктоп-приложении).
2. Создай новый файл (Drafts → New design file).
3. Открой плагин: **Menu → Plugins → Find more plugins → html.to.design** → Install.
4. Запусти плагин: **Plugins → html.to.design**.
5. В поле URL вставь по очереди каждую ссылку:

```
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/catalog.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/product.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/cart.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/checkout.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/order-confirmed.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/login.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-orders.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-order.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-profile.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-login.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-products.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-product-form.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-orders.html
https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-order.html
```

6. Каждая страница импортируется как отдельный фрейм. Их можно расставить по сетке и связать стрелочками в режиме Prototype для демонстрации навигации.

### Альтернативный плагин

Если html.to.design не подойдёт — есть аналог **Anima Inspect** или **Builder.io: Figma Plugin**. Все работают по схожему принципу: URL → импорт.

## Локальный просмотр

Для просмотра без интернета:

```bash
cd docs/04-prototypes
python -m http.server 8000
```

Затем открой `http://localhost:8000` в браузере.
