import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import QtySelector from '../../components/QtySelector/QtySelector';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import { useCart } from '../../context/CartContext';
import { products, getDiscountedPrice } from '../../data/products';
import styles from './CartPage.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function CartPage() {
  const { cartItems, removeItem, updateQty, clearCart, totalItems } = useCart();
  const navigate = useNavigate();

  const enriched = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    const unitPrice = variant ? getDiscountedPrice(variant.price, product.discountPct) : 0;
    return { ...item, product, variant, unitPrice };
  });

  const totalPrice = enriched.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const isEmpty = cartItems.length === 0;

  return (
    <>
      <Header />

      <main className={`${styles.main} ${styles.shell}`}>
        <Link to="/" className={styles.backLink}>← Продолжить покупки</Link>
        <h1 className={styles.pageTitle}>Корзина</h1>
        {!isEmpty && (
          <p className={styles.pageSub}>{totalItems} позиц. на сумму {totalPrice.toLocaleString('ru-RU')} ₽</p>
        )}

        {isEmpty ? (
          <div className={styles.emptyState}>
            <p>Корзина пуста</p>
            <Link to="/">Перейти в каталог</Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <section>
              <div className={styles.actionsTop}>
                <button className={styles.clearLink} onClick={clearCart} type="button">
                  Очистить корзину
                </button>
              </div>

              {enriched.map((item) => (
                <article key={`${item.productId}-${item.variantId}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <BottleIcon />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemBrand}>{item.product?.brand}</div>
                    <div className={styles.itemName}>
                      <Link to={`/product/${item.productId}`}>{item.product?.name}</Link>
                    </div>
                    <div className={styles.itemVolume}>Объём: {item.variant?.volume} мл</div>
                    <div className={styles.itemUnitPrice}>{item.unitPrice.toLocaleString('ru-RU')} ₽ за шт.</div>
                  </div>
                  <div className={styles.qtyArea}>
                    <QtySelector
                      qty={item.qty}
                      small
                      onIncrease={() => updateQty(item.productId, item.variantId, item.qty + 1)}
                      onDecrease={() => updateQty(item.productId, item.variantId, item.qty - 1)}
                    />
                  </div>
                  <div className={styles.itemTotalBlock}>
                    <div className={styles.itemTotal}>{(item.unitPrice * item.qty).toLocaleString('ru-RU')} ₽</div>
                    <button
                      className={styles.itemRemove}
                      onClick={() => removeItem(item.productId, item.variantId)}
                      title="Удалить"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <OrderSummary
              cartItems={cartItems}
              onCheckout={() => navigate('/checkout')}
              btnLabel="Оформить заказ"
              btnDisabled={isEmpty}
            />
          </div>
        )}
      </main>
    </>
  );
}
