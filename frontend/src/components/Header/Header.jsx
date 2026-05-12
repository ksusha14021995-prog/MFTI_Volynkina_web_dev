import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Header.module.css';

const CATEGORIES = [
  { label: 'Все', value: 'all' },
  { label: 'Женские', value: 'female' },
  { label: 'Мужские', value: 'male' },
  { label: 'Унисекс', value: 'unisex' },
];

export default function Header({ search = '', onSearchChange, activeCategory = 'all', onCategoryChange }) {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <div className={styles.headerRow}>
          <Link to="/" className={styles.logo}>КОМНАТА 26</Link>

          <form className={styles.search} onSubmit={handleSearchSubmit}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Найти аромат или бренд…"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <button className={styles.searchBtn} type="submit">Найти</button>
          </form>

          <div className={styles.icons}>
            <Link to="/cart" className={styles.iconBtn} title="Корзина">
              <svg viewBox="0 0 24 24">
                <path d="M3 6h2l2.5 11h11L21 9H7"/>
                <circle cx="9" cy="20" r="1.5"/>
                <circle cx="17" cy="20" r="1.5"/>
              </svg>
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </Link>
            <span className={styles.iconBtn} title="Личный кабинет">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
              </svg>
              <span className={styles.iconBtnLabel}>Войти</span>
            </span>
          </div>
        </div>

        {onCategoryChange && (
          <nav className={styles.cats}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.catLink} ${activeCategory === cat.value ? styles.catLinkActive : ''}`}
                onClick={() => onCategoryChange(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
