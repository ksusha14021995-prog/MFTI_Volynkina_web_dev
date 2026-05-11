import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function HeaderSimple({ backTo, backLabel }) {
  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <div className={styles.headerRow}>
          <Link to="/" className={styles.logo}>КОМНАТА 26</Link>
          {backTo && (
            <Link to={backTo} className={styles.iconBtn} style={{ color: '#777', fontSize: 13 }}>
              {backLabel || '← Назад'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
