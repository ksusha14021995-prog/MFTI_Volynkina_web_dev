import styles from './VolumeSelector.module.css';

export default function VolumeSelector({ variants, selectedVariantId, onSelect }) {
  return (
    <div className={styles.volumes}>
      <span className={styles.label}>Объём флакона</span>
      <div className={styles.grid}>
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isDisabled = variant.stock === 0;
          const isLowStock = variant.stock > 0 && variant.stock <= 2;

          return (
            <div
              key={variant.id}
              className={[
                styles.volume,
                isSelected ? styles.selected : '',
                isDisabled ? styles.disabled : '',
              ].join(' ')}
              onClick={() => !isDisabled && onSelect(variant.id)}
            >
              <div className={styles.vol}>{variant.volume} мл</div>
              <div className={styles.price}>{variant.price.toLocaleString('ru-RU')} ₽</div>
              {isLowStock && <div className={styles.stockWarn}>Осталось {variant.stock}</div>}
              {isDisabled && <div className={styles.out}>Нет в наличии</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
