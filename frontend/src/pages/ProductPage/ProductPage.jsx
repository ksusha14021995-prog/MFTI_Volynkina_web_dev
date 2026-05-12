import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VolumeSelector from '../../components/VolumeSelector/VolumeSelector';
import QtySelector from '../../components/QtySelector/QtySelector';
import { getProductById, getDiscountedPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import styles from './ProductPage.module.css';

const CATEGORY_LABELS = {
  all: 'Все',
  women: 'Женские',
  men: 'Мужские',
  unisex: 'Унисекс',
};

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [imgFailed, setImgFailed] = useState(false);

  const product = getProductById(id);

  const availableVariants = product?.variants.filter((v) => v.stock > 0) || [];
  const defaultVariant = availableVariants[0] || product?.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id || null);
  const [qty, setQty] = useState(1);

  if (!product) {
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

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const rawPrice = selectedVariant?.price || 0;
  const finalPrice = getDiscountedPrice(rawPrice, product.discountPct);
  const hasSale = product.discountPct > 0;

  function handleAddToCart() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    addItem(product.id, selectedVariant.id, qty);
    navigate('/cart');
  }

  const catLabel = CATEGORY_LABELS[product.category] || product.category;

  return (
    <>
      <Header />

      <main className={`${styles.main} ${styles.shell}`}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">← Каталог</Link>
          <span className={styles.sep}>/</span>
          <Link to={`/?category=${product.category}`}>{catLabel}</Link>
          <span className={styles.sep}>/</span>
          <span>{product.brand} — {product.name}</span>
        </nav>

        <div className={styles.product}>
          <div className={styles.productImage}>
            {product.badges.length > 0 && (
              <div className={styles.imageBadges}>
                {product.badges.includes('hit') && (
                  <span className={`${styles.badge} ${styles.badgeHit}`}>Хит продаж</span>
                )}
                {product.badges.includes('sale') && (
                  <span className={`${styles.badge} ${styles.badgeSale}`}>Скидка −{product.discountPct}%</span>
                )}
              </div>
            )}
            {product.image && !imgFailed ? (
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                className={styles.productImg}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <BottleIcon />
            )}
          </div>

          <div>
            <div className={styles.brand}>{product.brand}</div>
            <h1 className={styles.name}>{product.name}</h1>

            <VolumeSelector
              variants={product.variants}
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
                <div className={styles.priceSaleNote}>Скидка {product.discountPct}%</div>
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
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                В корзину
              </button>
            </div>

            <dl className={styles.meta}>
              <dt className={styles.metaDt}>Бренд</dt>
              <dd className={styles.metaDd}>{product.brand}</dd>
              <dt className={styles.metaDt}>Страна</dt>
              <dd className={styles.metaDd}>{product.country}</dd>
              <dt className={styles.metaDt}>Категория</dt>
              <dd className={styles.metaDd}>{catLabel}</dd>
            </dl>

            <h2 className={styles.descTitle}>Описание аромата</h2>
            <div className={styles.description}>
              {product.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
