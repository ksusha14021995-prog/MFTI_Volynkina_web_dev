import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import QtySelector from '../../components/QtySelector/QtySelector';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../../store/actions/cartActions';
import styles from './CartPage.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

function CartItemImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={styles.itemImg}
        onError={() => setFailed(true)}
      />
    );
  }
  return <BottleIcon />;
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.unit_price ?? 0) * i.quantity, 0);
  const isEmpty = items.length === 0;

  function handleUpdateQty(item, newQty) {
    if (newQty <= 0) {
      dispatch(removeCartItem(item.id));
    } else {
      dispatch(updateCartItem(item.id, newQty));
    }
  }

  return (
    <>
      <Header />

      <main className={`${styles.main} ${styles.shell}`}>
        <Link to="/" className={styles.backLink}>← Продолжить покупки</Link>
        <h1 className={styles.pageTitle}>Корзина</h1>
        {!isEmpty && (
          <p className={styles.pageSub}>{totalItems} позиц. на сумму {totalPrice.toLocaleString('ru-RU')} ₽</p>
        )}

        {loading && <p>Загрузка корзины...</p>}

        {!loading && isEmpty && (
          <div className={styles.emptyState}>
            <p>Корзина пуста</p>
            <Link to="/">Перейти в каталог</Link>
          </div>
        )}

        {!loading && !isEmpty && (
          <div className={styles.cartLayout}>
            <section>
              <div className={styles.actionsTop}>
                <button
                  className={styles.clearLink}
                  onClick={() => dispatch(clearCart())}
                  type="button"
                >
                  Очистить корзину
                </button>
              </div>

              {items.map((item) => (
                <article key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <CartItemImage
                      src={item.image_url}
                      alt={`${item.brand_name || ''} ${item.product_name || ''}`}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemBrand}>{item.brand_name}</div>
                    <div className={styles.itemName}>
                      {item.product_name}
                    </div>
                    {item.volume_ml && (
                      <div className={styles.itemVolume}>Объём: {item.volume_ml} мл</div>
                    )}
                    {item.unit_price != null && (
                      <div className={styles.itemUnitPrice}>{item.unit_price.toLocaleString('ru-RU')} ₽ за шт.</div>
                    )}
                  </div>
                  <div className={styles.qtyArea}>
                    <QtySelector
                      qty={item.quantity}
                      small
                      onIncrease={() => handleUpdateQty(item, item.quantity + 1)}
                      onDecrease={() => handleUpdateQty(item, item.quantity - 1)}
                    />
                  </div>
                  <div className={styles.itemTotalBlock}>
                    {item.unit_price != null && (
                      <div className={styles.itemTotal}>
                        {(item.unit_price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                    <button
                      className={styles.itemRemove}
                      onClick={() => dispatch(removeCartItem(item.id))}
                      title="Удалить"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className={styles.summary ?? ''}>
              <div>
                <div>Товары, {totalItems} шт.: {totalPrice.toLocaleString('ru-RU')} ₽</div>
                <div>Самовывоз: бесплатно</div>
                <div><strong>Итого: {totalPrice.toLocaleString('ru-RU')} ₽</strong></div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                style={{ marginTop: 16, padding: '12px 24px', cursor: 'pointer' }}
              >
                Оформить заказ
              </button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
