import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProducts, fetchBrands, fetchCountries } from '../../store/actions/productsActions';
import styles from './CatalogPage.module.css';

const PAGE_SIZE = 20;

export default function CatalogPage() {
  const dispatch = useDispatch();
  const { items, total, loading, error, brands, countries } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({
      page,
      limit: PAGE_SIZE,
      search,
      gender,
      brand_ids: selectedBrandIds,
      country_ids: selectedCountryIds,
      price_min: priceMin,
      price_max: priceMax,
    }));
  }, [dispatch, page, search, gender, selectedBrandIds, selectedCountryIds, priceMin, priceMax]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCountries());
  }, [dispatch]);

  function toggleBrandId(id) {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleCountryId(id) {
    setSelectedCountryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleCategoryChange(val) {
    // gender filter: 'all' → '', 'women'/'men'/'unisex' → pass as-is
    setGender(val === 'all' ? '' : val);
    setPage(1);
  }

  return (
    <>
      <Header
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        activeCategory={gender || 'all'}
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

              {brands.length > 0 && (
                <div className={styles.filterBlock}>
                  <h3>Бренд</h3>
                  {brands.map((brand) => (
                    <label key={brand.id} className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={selectedBrandIds.includes(brand.id)}
                        onChange={() => toggleBrandId(brand.id)}
                      />
                      {brand.name}
                    </label>
                  ))}
                </div>
              )}

              {countries.length > 0 && (
                <div className={styles.filterBlock}>
                  <h3>Страна</h3>
                  {countries.map((country) => (
                    <label key={country.id} className={styles.filterLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCountryIds.includes(country.id)}
                        onChange={() => toggleCountryId(country.id)}
                      />
                      {country.name}
                    </label>
                  ))}
                </div>
              )}

              <div className={styles.filterBlock}>
                <h3>Цена, ₽</h3>
                <div className={styles.priceRange}>
                  <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="от"
                    value={priceMin}
                    onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                  />
                  <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="до"
                    value={priceMax}
                    onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                  />
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className={styles.productsHead}>
              <h1>Каталог ароматов</h1>
              <span className={styles.count}>Найдено: {total}</span>
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            {!loading && (
              <div className={styles.grid}>
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  →
                </button>
              </nav>
            )}
          </section>
        </div>
      </main>

      <footer className={`${styles.footer} ${styles.shell}`}>
        КОМНАТА 26 / ДЗ-4 / МФТИ × Нетология / 2026
      </footer>
    </>
  );
}
