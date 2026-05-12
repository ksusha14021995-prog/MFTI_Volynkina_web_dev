import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import VolumeSelector from '../../components/VolumeSelector/VolumeSelector';
import QtySelector from '../../components/QtySelector/QtySelector';
import { fetchProduct } from '../../store/actions/productsActions';
import { addToCart } from '../../store/actions/cartActions';
import { getProductImageUrl } from '../../utils/imageUrl';
import styles from './ProductPage.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

const GENDER_LABELS = {
  female: 'Женские',
  male: 'Мужские',
  unisex: 'Унисекс',
};

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, productLoading, productError } = useSelector(
    (state) => state.products
  );

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(slug));
  }, [dispatch, slug]);

  // Set default variant once product loads
  useEffect(() => {
    if (product) {
      const available = product.variants.filter((v) => v.stock_quantity > 0);
      const def = available[0] || product.variants[0];
      setSelectedVariantId(def?.id || null);
    }
  }, [product]);

  if (productLoading) {
    return (
      <>
        <Header />
        <main className={`${styles.main} ${styles.shell}`}><p>Загрузка...</p></main>
      </>
    );
  }

  if (productError || !product) {
    return (
      <>
        <Header />
        <main className={`${styles.main} ${styles.shell}`}>
          <div className={styles.notFound}>
            <h1>Товар не найден</h1>
            <Link to="/">← Вернуться в каталог</Link>
          </div>
        </main>
      </>
    );
  }

  const brandName = product.brand?.name ?? '';
  const countryName = product.brand?.country?.name ?? '';
  const discountPct = product.discount_percent ?? 0;
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const rawPrice = selectedVariant ? Number(selectedVariant.price) : 0;
  const finalPrice = discountPct > 0 ? Math.round(rawPrice * (1 - discountPct / 100)) : rawPrice;
  const hasSale = discountPct > 0;
  const isOutOfStock = selectedVariant ? selectedVariant.stock_quantity === 0 : true;
  const genderLabel = GENDER_LABELS[product.gender] ?? product.gender ?? '';

  // Adapt variants for VolumeSelector (expects .volume and .stock fields)
  const adaptedVariants = product.variants.map((v) => ({
    ...v,
    volume: v.volume_ml,
    stock: v.stock_quantity,
  }));

  function handleAddToCart() {
    if (!selectedVariant || isOutOfStock) return;
    dispatch(addToCart(selectedVariant.id, qty));
    navigate('/cart');
  }

  return (
    <>
      <Header />

      <main className={`${styles.main} ${styles.shell}`}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">← Каталог</Link>
          <span className={styles.sep}>/</span>
          <span>{brandName} — {product.name}</span>
        </nav>

        <div className={styles.product}>
          <div className={styles.productImage}>
            {(product.is_hit || hasSale) && (
              <div className={styles.imageBadges}>
                {product.is_hit && (
                  <span className={`${styles.badge} ${styles.badgeHit}`}>Хит продаж</span>
                )}
                {hasSale && (
                  <span className={`${styles.badge} ${styles.badgeSale}`}>Скидка −{discountPct}%</span>
                )}
              </div>
            )}
            {getProductImageUrl(product) && !imgFailed ? (
              <img
                src={getProductImageUrl(product)}
                alt={`${brandName} ${product.name}`}
                className={styles.productImg}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <BottleIcon />
            )}
          </div>

          <div>
            <div className={styles.brand}>{brandName}</div>
            <h1 className={styles.name}>{product.name}</h1>

            <VolumeSelector
              variants={adaptedVariants}
              selectedVariantId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />

            <div className={styles.priceBlock}>
              <div>
                {hasSale && (
                  <span className={styles.priceOld}>{rawPrice.toLocaleString('ru-RU')} ₽</span>
                )}
                <span className={styles.priceCurrent}>{finalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              {hasSale && (
                <div className={styles.priceSaleNote}>Скидка {discountPct}%</div>
              )}
            </div>

            <div className={styles.cartActions}>
              <QtySelector
                qty={qty}
                onIncrease={() => setQty((q) => q + 1)}
                onDecrease={() => setQty((q) => Math.max(1, q - 1))}
              />
              <button
                className={styles.btnCart}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                В корзину
              </button>
            </div>

            <dl className={styles.meta}>
              <dt className={styles.metaDt}>Бренд</dt>
              <dd className={styles.metaDd}>{brandName}</dd>
              {countryName && (
                <>
                  <dt className={styles.metaDt}>Страна</dt>
                  <dd className={styles.metaDd}>{countryName}</dd>
                </>
              )}
              {genderLabel && (
                <>
                  <dt className={styles.metaDt}>Категория</dt>
                  <dd className={styles.metaDd}>{genderLabel}</dd>
                </>
              )}
            </dl>

            {product.description && (
              <>
                <h2 className={styles.descTitle}>Описание аромата</h2>
                <div className={styles.description}>
                  {product.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
