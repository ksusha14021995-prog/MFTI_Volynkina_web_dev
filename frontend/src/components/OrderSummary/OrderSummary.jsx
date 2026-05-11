import { products, getDiscountedPrice } from '../../data/products';
import styles from './OrderSummary.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function OrderSummary({ cartItems, onCheckout, btnLabel = 'Оформить заказ', btnDisabled = false, showItems = false, terms = false }) {
  const enriched = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    const unitPrice = variant ? getDiscountedPrice(variant.price, product.discountPct) : 0;
    return { ...item, product, variant, unitPrice };
  });

  const totalItems = enriched.reduce((s, i) => s + i.qty, 0);
  const totalPrice = enriched.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  return (
    <aside className={styles.summary}>
      <h2 className={styles.title}>Ваш заказ</h2>

      {showItems && (
        <div className={styles.items}>
          {enriched.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className={styles.item}>
              <div className={styles.itemImg}><BottleIcon /></div>
              <div className={styles.itemInfo}>
                <div className={styles.itemBrand}>{item.product?.brand}</div>
                <div className={styles.itemName}>{item.product?.name}</div>
                <div className={styles.itemVol}>{item.variant?.volume} мл · {item.qty} шт.</div>
              </div>
              <div className={styles.itemPrice}>{(item.unitPrice * item.qty).toLocaleString('ru-RU')} ₽</div>
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
