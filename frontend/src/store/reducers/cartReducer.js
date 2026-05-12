import {
  CART_REQUEST, CART_SUCCESS, CART_FAILURE,
} from '../actionTypes';

const initialState = {
  // enriched items: CartItemRead fields + product_name, brand_name, volume_ml, unit_price
  items: [],
  loading: false,
  error: null,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case CART_REQUEST:
      return { ...state, loading: true, error: null };
    case CART_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case CART_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
