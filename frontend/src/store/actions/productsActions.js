import {
  PRODUCTS_REQUEST, PRODUCTS_SUCCESS, PRODUCTS_FAILURE,
  PRODUCT_REQUEST,  PRODUCT_SUCCESS,  PRODUCT_FAILURE,
  BRANDS_REQUEST,   BRANDS_SUCCESS,   BRANDS_FAILURE,
  COUNTRIES_REQUEST, COUNTRIES_SUCCESS, COUNTRIES_FAILURE,
} from '../actionTypes';

export function fetchProducts(params = {}) {
  return async function (dispatch) {
    dispatch({ type: PRODUCTS_REQUEST });
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        gender = '',
        brand_ids = [],
        country_ids = [],
        price_min = '',
        price_max = '',
      } = params;

      const qs = new URLSearchParams();
      qs.set('page', page);
      qs.set('limit', limit);
      if (search)    qs.set('search', search);
      if (gender)    qs.set('gender', gender);
      if (price_min) qs.set('price_min', price_min);
      if (price_max) qs.set('price_max', price_max);
      brand_ids.forEach((id) => qs.append('brand_ids[]', id));
      country_ids.forEach((id) => qs.append('country_ids[]', id));

      const res = await fetch(`/api/catalog/products?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: PRODUCTS_SUCCESS, payload: { items: data.items, total: data.total } });
    } catch (err) {
      dispatch({ type: PRODUCTS_FAILURE, payload: err.message });
    }
  };
}

export function fetchProduct(slug) {
  return async function (dispatch) {
    dispatch({ type: PRODUCT_REQUEST });
    try {
      const res = await fetch(`/api/catalog/products/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: PRODUCT_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: PRODUCT_FAILURE, payload: err.message });
    }
  };
}

export function fetchBrands() {
  return async function (dispatch) {
    dispatch({ type: BRANDS_REQUEST });
    try {
      const res = await fetch('/api/catalog/brands');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: BRANDS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: BRANDS_FAILURE, payload: err.message });
    }
  };
}

export function fetchCountries() {
  return async function (dispatch) {
    dispatch({ type: COUNTRIES_REQUEST });
    try {
      const res = await fetch('/api/catalog/countries');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: COUNTRIES_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: COUNTRIES_FAILURE, payload: err.message });
    }
  };
}
