# 04. Прототипы интерфейсов

Адаптивные прототипы всех страниц интернет-магазина «КОМНАТА 26» — покупательской части и админ-панели.

🎨 **Figma:** https://www.figma.com/design/8BTliuTBG95md8xLLUIaxu/ROOM26?node-id=0-1&t=4oebb9DUsDMoMrrI-1

## Хостинг

Прототипы развёрнуты на GitHub Pages и открываются как обычный сайт:

🔗 **https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/**

Главная страница содержит ссылки на все 14 экранов и работает как навигационный хаб. Все ссылки между страницами тоже кликабельные — можно пройти полный user flow от каталога до подтверждения заказа.

## Список экранов

| Раздел | Экран | Наименование | HTML |
|--------|-------|--------------|------|
| Покупатель | 1 | Каталог | [catalog.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/catalog.html) |
| Покупатель | 2 | Карточка товара | [product.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/product.html) |
| Покупатель | 3 | Корзина | [cart.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/cart.html) |
| Покупатель | 4 | Оформление заказа | [checkout.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/checkout.html) |
| Покупатель | 5 | Подтверждение заказа | [order-confirmed.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/order-confirmed.html) |
| Покупатель | 6 | Вход / регистрация | [login.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/login.html) |
| Покупатель | 7 | ЛК: история заказов | [account-orders.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-orders.html) |
| Покупатель | 8 | ЛК: детали заказа | [account-order.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-order.html) |
| Покупатель | 9 | ЛК: профиль | [account-profile.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/account-profile.html) |
| Админка | 10 | Вход в админку | [admin-login.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-login.html) |
| Админка | 11 | Список товаров | [admin-products.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-products.html) |
| Админка | 12 | Карточка товара (редактирование) | [admin-product-form.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-product-form.html) |
| Админка | 13 | Список заказов | [admin-orders.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-orders.html) |
| Админка | 14 | Карточка заказа | [admin-order.html](https://ksusha14021995-prog.github.io/MFTI_Volynkina_web_dev/04-prototypes/admin-order.html) |

## Локальный просмотр

Для просмотра без интернета:

```bash
cd docs/04-prototypes
python -m http.server 8000
```

Затем открой `http://localhost:8000` в браузере.
