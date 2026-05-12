import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSimple from '../../components/Header/HeaderSimple';
import { fetchOrder } from '../../store/actions/ordersActions';
import styles from './OrderConfirmedPage.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function OrderConfirmedPage() {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(orderNumber));
  }, [dispatch, orderNumber]);

  if (loading) {
    return (
      <>
        <HeaderSimple backTo="/" backLabel="← В каталог" />
        <main className={`${styles.main} ${styles.shell}`}><p>Загрузка заказа...</p></main>
      </>
    );
  }

  if (error || !currentOrder) {
    return (
      <>
        <HeaderSimple backTo="/" backLabel="← В каталог" />
        <main className={`${styles.main} ${styles.shell}`}>
          <div className={styles.confirmed}>
            <h1 className={styles.h1}>Заказ не найден</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.actions}>
              <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>В каталог</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const order = currentOrder;
  const totalAmount = order.total_amount;
  const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <>
      <HeaderSimple backTo="/" backLabel="← В каталог" />

      <main className={`${styles.main} ${styles.shell}`}>
        <div className={styles.confirmed}>

          <div className={styles.checkIcon}>
            <svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6"/></svg>
          </div>

          <h1 className={styles.h1}>Заказ оформлен</h1>
          <p className={styles.orderNumber}>Номер заказа <strong>№ {order.order_number}</strong></p>
          {order.contact_email && (
            <p className={styles.confirmMsg}>Мы отправим подтверждение на {order.contact_email}</p>
          )}

          <div className={styles.cards}>
            <div className={styles.card}>
              <h2>Контакты</h2>
              <div className={styles.cardRow}>
                <strong>{order.contact_name}</strong>
                <br />{order.contact_phone}
                <br />{order.contact_email}
              </div>
            </div>
            <div className={styles.card}>
              <h2>Точка самовывоза</h2>
              <div className={styles.cardRow}>
                <strong>{order.pickup_point?.address}</strong>
                <br />{order.pickup_point?.city}
                <br />{order.pickup_point?.working_hours}
              </div>
            </div>
          </div>

          <div className={styles.itemsBlock}>
            <h2 className={styles.itemsTitle}>Состав заказа</h2>
            {order.items?.map((item, i) => (
              <div key={item.id ?? i} className={styles.item}>
                <div className={styles.itemImg}><BottleIcon /></div>
                <div>
                  <div className={styles.itemBrand}>{item.brand_name}</div>
                  <div className={styles.itemName}>{item.product_name}</div>
                  <div className={styles.itemVol}>{item.volume_ml} мл · {item.quantity} шт.</div>
                </div>
                <div className={styles.itemPrice}>
                  {Number(item.subtotal ?? item.unit_price * item.quantity).toLocaleString('ru-RU')} ₽
                </div>
              </div>
            ))}

            <div className={styles.totals}>
              <div className={styles.totalsRow}>
                <span>Товары, {totalItems} шт.</span>
                <span>{Number(totalAmount).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className={`${styles.totalsRow} ${styles.totalsRowMuted}`}>
                <span>Самовывоз</span>
                <span>бесплатно</span>
              </div>
              <div className={`${styles.totalsRow} ${styles.totalsRowTotal}`}>
                <span>К оплате при получении</span>
                <span>{Number(totalAmount).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

          <div className={styles.next}>
            <h2>Что дальше</h2>
            <ol>
              <li>Менеджер подтвердит заказ по телефону в течение часа.</li>
              <li>После подтверждения мы соберём заказ — обычно за 1–2 рабочих дня.</li>
              <li>Когда заказ будет готов, мы напишем — приходите в выбранную точку самовывоза.</li>
              <li>Оплата — при получении наличными или картой.</li>
            </ol>
          </div>

          <div className={styles.actions}>
            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>Продолжить покупки</Link>
          </div>

        </div>
      </main>
    </>
  );
}
