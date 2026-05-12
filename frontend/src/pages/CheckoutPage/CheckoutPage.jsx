import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSimple from '../../components/Header/HeaderSimple';
import { fetchPickupPoints, createOrder } from '../../store/actions/ordersActions';
import { clearCart } from '../../store/actions/cartActions';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickupPoints, pickupLoading, loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orders
  );
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchPickupPoints());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickupPointId: null,
  });
  const [errors, setErrors] = useState({});

  // Set default pickup point once loaded
  useEffect(() => {
    if (pickupPoints.length > 0 && !form.pickupPointId) {
      setForm((f) => ({ ...f, pickupPointId: pickupPoints[0].id }));
    }
  }, [pickupPoints]);

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
    if (!form.pickupPointId) errs.pickupPointId = 'Выберите точку самовывоза';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const order = await dispatch(createOrder({
      pickup_point_id: form.pickupPointId,
      contact_name: form.name,
      contact_phone: form.phone,
      contact_email: form.email,
    }));

    if (order) {
      dispatch(clearCart());
      navigate(`/order/${order.order_number}`);
    }
  }

  return (
    <>
      <HeaderSimple backTo="/cart" backLabel="← Вернуться в корзину" />

      <main className={`${styles.main} ${styles.shell}`}>
        <h1 className={styles.pageTitle}>Оформление заказа</h1>

        {orderError && (
          <p style={{ color: 'red' }}>Ошибка: {orderError}</p>
        )}

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
                {pickupLoading && <p>Загрузка точек самовывоза...</p>}
                <div className={styles.pickupList}>
                  {pickupPoints.filter((pt) => pt.is_active !== false).map((pt) => (
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
                        <div className={styles.pickupName}>{pt.address}</div>
                        <div className={styles.pickupAddr}>{pt.city}</div>
                        <div className={styles.pickupHours}>{pt.working_hours}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.pickupPointId && (
                  <span className={styles.errorMsg}>{errors.pickupPointId}</span>
                )}
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

              <button
                type="submit"
                disabled={orderLoading}
                style={{ marginTop: 16, padding: '12px 32px', cursor: 'pointer' }}
              >
                {orderLoading ? 'Оформляем...' : 'Оформить заказ'}
              </button>
            </form>
          </section>

          <aside>
            <h2>Ваш заказ</h2>
            {cartItems.map((item) => (
              <div key={item.id} style={{ marginBottom: 8 }}>
                <div>{item.brand_name} {item.product_name}</div>
                {item.volume_ml && <div>{item.volume_ml} мл · {item.quantity} шт.</div>}
                {item.unit_price != null && (
                  <div>{(item.unit_price * item.quantity).toLocaleString('ru-RU')} ₽</div>
                )}
              </div>
            ))}
            <div style={{ marginTop: 16, fontWeight: 'bold' }}>
              Итого: {cartItems.reduce((s, i) => s + (i.unit_price ?? 0) * i.quantity, 0).toLocaleString('ru-RU')} ₽
            </div>
            <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Нажимая «Оформить заказ», вы принимаете условия оферты и согласие на обработку персональных данных.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
