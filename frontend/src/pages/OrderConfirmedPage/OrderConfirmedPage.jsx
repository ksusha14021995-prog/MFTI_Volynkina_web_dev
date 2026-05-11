import { useParams, useLocation, Link } from 'react-router-dom';
import HeaderSimple from '../../components/Header/HeaderSimple';
import styles from './OrderConfirmedPage.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function OrderConfirmedPage() {
  const { id } = useParams();
  const location = useLocation();

  let orderData = location.state;
  if (!orderData) {
    try {
      const raw = localStorage.getItem(`order_${id}`);
      orderData = raw ? JSON.parse(raw) : null;
    } catch {
      orderData = null;
    }
  }

  if (!orderData) {
    return (
      <>
        <HeaderSimple backTo="/" backLabel="← В каталог" />
        <main className={`${styles.main} ${styles.shell}`}>
          <div className={styles.confirmed}>
            <h1 className={styles.h1}>Заказ не найден</h1>
            <div className={styles.actions}>
              <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>В каталог</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const { orderId, items, contact, pickupPoint, totalPrice, totalItems } = orderData;

  return (
    <>
      <HeaderSimple backTo="/" backLabel="← В каталог" />

      <main className={`${styles.main} ${styles.shell}`}>
        <div className={styles.confirmed}>

          <div className={styles.checkIcon}>
            <svg viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6"/></svg>
          </div>

          <h1 className={styles.h1}>Заказ оформлен</h1>
          <p className={styles.orderNumber}>Номер заказа <strong>№ {orderId}</strong></p>
          {contact?.email && (
            <p className={styles.confirmMsg}>Мы отправим подтверждение на {contact.email}</p>
          )}

          <div className={styles.cards}>
            <div className={styles.card}>
              <h2>Контакты</h2>
              <div className={styles.cardRow}>
                <strong>{contact?.name}</strong>
                {contact?.phone}<br />
                {contact?.email}
              </div>
            </div>
            <div className={styles.card}>
              <h2>Точка самовывоза</h2>
              <div className={styles.cardRow}>
                <strong>{pickupPoint?.name}</strong>
                {pickupPoint?.address}<br />
                {pickupPoint?.hours}
              </div>
            </div>
          </div>

          <div className={styles.itemsBlock}>
            <h2 className={styles.itemsTitle}>Состав заказа</h2>
            {items.map((item, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemImg}><BottleIcon /></div>
                <div>
                  <div className={styles.itemBrand}>{item.product?.brand}</div>
                  <div className={styles.itemName}>{item.product?.name}</div>
                  <div className={styles.itemVol}>{item.variant?.volume} мл · {item.qty} шт.</div>
                </div>
                <div className={styles.itemPrice}>{(item.unitPrice * item.qty).toLocaleString('ru-RU')} ₽</div>
              </div>
            ))}

            <div className={styles.totals}>
              <div className={styles.totalsRow}>
                <span>Товары, {totalItems} шт.</span>
                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className={`${styles.totalsRow} ${styles.totalsRowMuted}`}>
                <span>Самовывоз</span>
                <span>бесплатно</span>
              </div>
              <div className={`${styles.totalsRow} ${styles.totalsRowTotal}`}>
                <span>К оплате при получении</span>
                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
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
