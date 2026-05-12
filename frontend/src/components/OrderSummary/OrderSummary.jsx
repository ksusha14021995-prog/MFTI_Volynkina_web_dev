// OrderSummary now accepts enriched cart items from Redux store
// Each item has: quantity, unit_price, product_name, brand_name, volume_ml
import styles from './OrderSummary.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function OrderSummary({ cartItems = [], onCheckout, btnLabel = 'Оформить заказ', btnDisabled = false, showItems = false, terms = false }) {
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => s + (i.unit_price ?? 0) * i.quantity, 0);

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Ваш заказ</h2>

      {showItems && (
        <div className={styles.items}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemImg}><BottleIcon /></div>
              <div className={styles.itemInfo}>
                <div className={styles.itemBrand}>{item.brand_name}</div>
                <div className={styles.itemName}>{item.product_name}</div>
                {item.volume_ml && (
                  <div className={styles.itemVol}>{item.volume_ml} мл · {item.quantity} шт.</div>
                )}
              </div>
              {item.unit_price != null && (
                <div className={styles.itemPrice}>{(item.unit_price * item.quantity).toLocaleString('ru-RU')} ₽</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.row}>
        <span>Товары, {totalItems} шт.</span>
        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
      </div>
      <div className={`${styles.row} ${styles.rowMuted}`}>
        <span>Самовывоз</span>
        <span>бесплатно</span>
      </div>
      <div className={`${styles.row} ${styles.rowTotal}`}>
        <span>Итого</span>
        <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
      </div>

      {onCheckout && (
        <button className={styles.btn} onClick={onCheckout} disabled={btnDisabled}>
          {btnLabel}
        </button>
      )}

      {terms && (
        <p className={styles.note}>
          Нажимая «Оформить заказ», вы принимаете условия оферты и согласие на обработку персональных данных.
        </p>
      )}

      {!onCheckout && (
        <p className={styles.note}>Оплата при получении в точке самовывоза</p>
      )}
    </aside>
  );
}
