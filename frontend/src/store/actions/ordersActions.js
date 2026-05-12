import {
  PICKUP_POINTS_REQUEST, PICKUP_POINTS_SUCCESS, PICKUP_POINTS_FAILURE,
  ORDER_CREATE_REQUEST,  ORDER_CREATE_SUCCESS,  ORDER_CREATE_FAILURE,
  ORDER_FETCH_REQUEST,   ORDER_FETCH_SUCCESS,   ORDER_FETCH_FAILURE,
} from '../actionTypes';
import { getSessionId } from '../session';

function sessionHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
  };
}

export function fetchPickupPoints() {
  return async function (dispatch) {
    dispatch({ type: PICKUP_POINTS_REQUEST });
    try {
      const res = await fetch('/api/pickup-points');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: PICKUP_POINTS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: PICKUP_POINTS_FAILURE, payload: err.message });
    }
  };
}

export function createOrder(payload) {
  return async function (dispatch) {
    dispatch({ type: ORDER_CREATE_REQUEST });
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: sessionHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
      return data;
    } catch (err) {
      dispatch({ type: ORDER_CREATE_FAILURE, payload: err.message });
      return null;
    }
  };
}

export function fetchOrder(orderNumber) {
  return async function (dispatch) {
    dispatch({ type: ORDER_FETCH_REQUEST });
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        headers: sessionHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: ORDER_FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ORDER_FETCH_FAILURE, payload: err.message });
    }
  };
}
