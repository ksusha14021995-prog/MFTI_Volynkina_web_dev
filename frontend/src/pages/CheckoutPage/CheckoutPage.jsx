import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSimple from '../../components/Header/HeaderSimple';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import { useCart } from '../../context/CartContext';
import { pickupPoints } from '../../data/pickupPoints';
import { products, getDiscountedPrice } from '../../data/products';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickupPointId: pickupPoints[0].id,
  });
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Введите имя';
    if (!form.phone.trim()) errs.phone = 'Введите телефон';
    if (!form.email.trim()) errs.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Некорректный email';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const orderId = `26-${Date.now()}`;
    const pickupPoint = pickupPoints.find((p) => p.id === form.pickupPointId);

    const enrichedItems = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      const unitPrice = variant ? getDiscountedPrice(variant.price, product.discountPct) : 0;
      return { ...item, product, variant, unitPrice };
    });

    const totalPrice = enrichedItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const totalItems = enrichedItems.reduce((s, i) => s + i.qty, 0);

    const orderData = {
      orderId,
      items: enrichedItems,
      contact: { name: form.name, phone: form.phone, email: form.email },
      pickupPoint,
      totalPrice,
      totalItems,
    };

    localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
    clearCart();
    navigate(`/order/${orderId}`, { state: orderData });
  }

  return (
    <>
      <HeaderSimple backTo="/cart" backLabel="← Вернуться в корзину" />

      <main className={`${styles.main} ${styles.shell}`}>
        <h1 className={styles.pageTitle}>Оформление заказа</h1>

        <div className={styles.layout}>
          <section>
            <form onSubmit={handleSubmit} noValidate>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.step}>1</span>
                  Ваши данные
                </h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.field} ${styles.fieldFull} ${errors.name ? styles.fieldError : ''}`}>
                    <label>Имя</label>
                    <input
                      type="text"
                      placeholder="Имя"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                    {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                  </div>
                  <div className={`${styles.field} ${errors.phone ? styles.fieldError : ''}`}>
                    <label>Телефон</label>
                    <input
                      type="tel"
                      placeholder="+7 ___ ___ __ __"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                    {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                  </div>
                  <div className={`${styles.field} ${errors.email ? styles.fieldError : ''}`}>
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                    {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.step}>2</span>
                  Точка самовывоза
                </h2>
                <div className={styles.pickupList}>
                  {pickupPoints.map((pt) => (
                    <label
                      key={pt.id}
                      className={`${styles.pickupOption} ${form.pickupPointId === pt.id ? styles.pickupSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="pickup"
                        checked={form.pickupPointId === pt.id}
                        onChange={() => setField('pickupPointId', pt.id)}
                      />
                      <div className={styles.pickupInfo}>
                        <div className={styles.pickupName}>{pt.name}</div>
                        <div className={styles.pickupAddr}>{pt.address}</div>
                        <div className={styles.pickupHours}>{pt.hours}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.step}>3</span>
                  Способ оплаты
                </h2>
                <div className={styles.paymentInfo}>
                  <strong>Оплата при получении</strong>
                  <p>Вы оплачиваете заказ наличными или картой в точке самовывоза в момент получения.</p>
                </div>
              </div>

              {/* Hidden submit — triggered from OrderSummary */}
              <button type="submit" id="checkout-submit" style={{ display: 'none' }} />
            </form>
          </section>

          <OrderSummary
            cartItems={cartItems}
            onCheckout={() => document.getElementById('checkout-submit')?.click()}
            btnLabel="Оформить заказ"
            showItems
            terms
          />
        </div>
      </main>
    </>
  );
}
