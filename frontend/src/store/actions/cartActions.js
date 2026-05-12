import {
  CART_REQUEST, CART_SUCCESS, CART_FAILURE,
} from '../actionTypes';
import { getSessionId } from '../session';
import { getProductImageUrl } from '../../utils/imageUrl';

const CART_API = '/api/cart';

function sessionHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
  };
}

// Enrich raw cart items with product/variant info from current store state
async function enrichItems(rawItems, getState) {
  const { products } = getState();

  // Build a lookup from variant id → product info using already-loaded catalog
  const variantMap = {};
  products.items.forEach((p) => {
    p.variants.forEach((v) => {
      variantMap[v.id] = {
        product_name: p.name,
        brand_name: p.brand ? p.brand.name : '',
        volume_ml: v.volume_ml,
        unit_price: Number(v.price),
        image_url: getProductImageUrl(p),
      };
    });
  });

  // For variant ids not in the map, fetch from catalog
  const missingVariantProductIds = rawItems
    .filter((item) => !variantMap[item.product_variant_id])
    .map((item) => item.product_variant_id);

  if (missingVariantProductIds.length > 0) {
    // Fetch all products and rebuild map
    try {
      const res = await fetch('/api/catalog/products?limit=100&page=1');
      if (res.ok) {
        const data = await res.json();
        data.items.forEach((p) => {
          p.variants.forEach((v) => {
            variantMap[v.id] = {
              product_name: p.name,
              brand_name: p.brand ? p.brand.name : '',
              volume_ml: v.volume_ml,
              unit_price: Number(v.price),
              image_url: getProductImageUrl(p),
            };
          });
        });
      }
    } catch {
      // enrichment fails silently — names will be undefined
    }
  }

  return rawItems.map((item) => ({
    ...item,
    ...(variantMap[item.product_variant_id] || {}),
  }));
}

export function fetchCart() {
  return async function (dispatch, getState) {
    dispatch({ type: CART_REQUEST });
    try {
      const res = await fetch(CART_API, { headers: sessionHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const enriched = await enrichItems(data.items || [], getState);
      dispatch({ type: CART_SUCCESS, payload: enriched });
    } catch (err) {
      dispatch({ type: CART_FAILURE, payload: err.message });
    }
  };
}

export function addToCart(variantId, qty = 1) {
  return async function (dispatch, getState) {
    dispatch({ type: CART_REQUEST });
    try {
      const res = await fetch(`${CART_API}/items`, {
        method: 'POST',
        headers: sessionHeaders(),
        body: JSON.stringify({ product_variant_id: variantId, quantity: qty }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const enriched = await enrichItems(data.items || [], getState);
      dispatch({ type: CART_SUCCESS, payload: enriched });
    } catch (err) {
      dispatch({ type: CART_FAILURE, payload: err.message });
    }
  };
}

export function updateCartItem(itemId, qty) {
  return async function (dispatch, getState) {
    dispatch({ type: CART_REQUEST });
    try {
      const res = await fetch(`${CART_API}/items/${itemId}`, {
        method: 'PATCH',
        headers: sessionHeaders(),
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const enriched = await enrichItems(data.items || [], getState);
      dispatch({ type: CART_SUCCESS, payload: enriched });
    } catch (err) {
      dispatch({ type: CART_FAILURE, payload: err.message });
    }
  };
}

export function removeCartItem(itemId) {
  return async function (dispatch, getState) {
    dispatch({ type: CART_REQUEST });
    try {
      const res = await fetch(`${CART_API}/items/${itemId}`, {
        method: 'DELETE',
        headers: sessionHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // 204 no content — refetch cart
      const refetchRes = await fetch(CART_API, { headers: sessionHeaders() });
      if (!refetchRes.ok) throw new Error(`HTTP ${refetchRes.status}`);
      const data = await refetchRes.json();
      const enriched = await enrichItems(data.items || [], getState);
      dispatch({ type: CART_SUCCESS, payload: enriched });
    } catch (err) {
      dispatch({ type: CART_FAILURE, payload: err.message });
    }
  };
}

export function clearCart() {
  return async function (dispatch) {
    dispatch({ type: CART_REQUEST });
    try {
      const res = await fetch(CART_API, {
        method: 'DELETE',
        headers: sessionHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      dispatch({ type: CART_SUCCESS, payload: [] });
    } catch (err) {
      dispatch({ type: CART_FAILURE, payload: err.message });
    }
  };
}
