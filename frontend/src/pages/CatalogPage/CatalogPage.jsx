import { useState, useMemo } from 'react';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import { products } from '../../data/products';
import styles from './CatalogPage.module.css';

const PAGE_SIZE = 9;

const ALL_BRANDS = [...new Set(products.map((p) => p.brand))].sort();
const ALL_COUNTRIES = [...new Set(products.map((p) => p.country))].sort();

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleBrand(brand) {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  }

  function toggleCountry(country) {
    setCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const from = priceFrom ? Number(priceFrom) : 0;
    const to = priceTo ? Number(priceTo) : Infinity;

    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (countries.length && !countries.includes(p.country)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      const minP = Math.min(...p.variants.map((v) => v.price));
      if (minP < from || minP > to) return false;
      return true;
    });
  }, [search, category, brands, countries, priceFrom, priceTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleCategoryChange(val) {
    setCategory(val);
    setPage(1);
  }

  return (
    <>
      <Header
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      <main className={`${styles.main} ${styles.shell}`}>
        <div className={styles.layout}>

          <aside className={styles.filters}>
            <button
              className={styles.filtersToggleLabel}
              onClick={() => setFiltersOpen((o) => !o)}
              type="button"
            >
              Фильтры
            </button>
            <div className={filtersOpen ? styles.filtersBodyOpen : `${styles.filtersBody} ${styles.filtersBodyClosed}`}>
              <h2 className={styles.filtersH2}>Фильтры</h2>

              <div className={styles.filterBlock}>
                <h3>Бренд</h3>
                {ALL_BRANDS.map((brand) => (
                  <label key={brand} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>

              <div className={styles.filterBlock}>
                <h3>Страна</h3>
                {ALL_COUNTRIES.map((country) => (
                  <label key={country} className={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={countries.includes(country)}
                      onChange={() => toggleCountry(country)}
                    />
                    {country}
                  </label>
                ))}
              </div>

              <div className={styles.filterBlock}>
                <h3>Цена, ₽</h3>
                <div className={styles.priceRange}>
                  <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="от"
                    value={priceFrom}
                    onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
                  />
                  <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="до"
                    value={priceTo}
                    onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
                  />
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className={styles.productsHead}>
              <h1>Каталог ароматов</h1>
              <span className={styles.count}>Найдено: {filtered.length}</span>
            </div>

            <div className={styles.grid}>
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`${styles.pageBtn} ${n === safePage ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  →
                </button>
              </nav>
            )}
          </section>
        </div>
      </main>

      <footer className={`${styles.footer} ${styles.shell}`}>
        КОМНАТА 26 / ДЗ-3 / МФТИ × Нетология / 2026
      </footer>
    </>
  );
}
