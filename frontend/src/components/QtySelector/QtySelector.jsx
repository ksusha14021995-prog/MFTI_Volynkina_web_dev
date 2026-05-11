import styles from './QtySelector.module.css';

export default function QtySelector({ qty, onIncrease, onDecrease, small = false }) {
  return (
    <div className={`${styles.qty} ${small ? styles.qtySmall : ''}`}>
      <button
        className={`${styles.btn} ${small ? styles.btnSmall : ''}`}
        onClick={onDecrease}
        type="button"
      >
        −
      </button>
      <input
        className={`${styles.input} ${small ? styles.inputSmall : ''}`}
        type="text"
        value={qty}
        readOnly
      />
      <button
        className={`${styles.btn} ${small ? styles.btnSmall : ''}`}
        onClick={onIncrease}
        type="button"
      >
        +
      </button>
    </div>
  );
}
