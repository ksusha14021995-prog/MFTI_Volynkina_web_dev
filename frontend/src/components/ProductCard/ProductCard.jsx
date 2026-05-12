import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMinPrice, getDiscountedPrice } from '../../data/products';
import styles from './ProductCard.module.css';

const BottleIcon = () => (
  <svg viewBox="0 0 64 96" fill="none" stroke="#666" strokeWidth="2">
    <path d="M22 6h20v14h6v8H16v-8h6V6z"/>
    <rect x="14" y="28" width="36" height="60" rx="3"/>
  </svg>
);

export default function ProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const minPrice = getMinPrice(product);
  const discountedMin = getDiscountedPrice(minPrice, product.discountPct);
  const hasSale = product.discountPct > 0;

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.cardImage}>
        {product.badges.length > 0 && (
          <div className={styles.badges}>
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
      <div className={styles.cardBrand}>{product.brand}</div>
      <div className={styles.cardName}>{product.name}</div>
      <div className={styles.cardPrice}>
        {hasSale ? (
          <>
            <span className="from">от</span>
            <span className="old">{minPrice.toLocaleString('ru-RU')} ₽</span>
            {discountedMin.toLocaleString('ru-RU')} ₽
          </>
        ) : (
          <>
            <span className="from">от </span>
            {minPrice.toLocaleString('ru-RU')} ₽
          </>
        )}
      </div>
    </Link>
  );
}
