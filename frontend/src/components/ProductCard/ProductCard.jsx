import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../../utils/imageUrl';
import styles from './ProductCard.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function ProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Support both backend shape and any legacy shape
  const brandName = product.brand?.name ?? product.brand ?? '';
  const minPrice = product.min_price != null ? Number(product.min_price) : null;
  const discountPct = product.discount_percent ?? 0;
  const isHit = product.is_hit ?? false;

  const hasSale = discountPct > 0;
  const discountedMin = minPrice != null
    ? Math.round(minPrice * (1 - discountPct / 100))
    : null;

  return (
    <Link to={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.cardImage}>
        {(isHit || hasSale) && (
          <div className={styles.badges}>
            {isHit && (
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
      <div className={styles.cardBrand}>{brandName}</div>
      <div className={styles.cardName}>{product.name}</div>
      {minPrice != null && (
        <div className={styles.cardPrice}>
          {hasSale ? (
            <>
              <span className={styles.old}>{minPrice.toLocaleString('ru-RU')} ₽</span>
              {discountedMin.toLocaleString('ru-RU')} ₽
            </>
          ) : (
            <>
              <span className={styles.from}>от </span>
              {minPrice.toLocaleString('ru-RU')} ₽
            </>
          )}
        </div>
      )}
    </Link>
  );
}
