import {
  PRODUCTS_REQUEST, PRODUCTS_SUCCESS, PRODUCTS_FAILURE,
  PRODUCT_REQUEST,  PRODUCT_SUCCESS,  PRODUCT_FAILURE,
  BRANDS_REQUEST,   BRANDS_SUCCESS,   BRANDS_FAILURE,
  COUNTRIES_REQUEST, COUNTRIES_SUCCESS, COUNTRIES_FAILURE,
} from '../actionTypes';

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  currentProduct: null,
  productLoading: false,
  productError: null,
  brands: [],
  countries: [],
  filters: {},
};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case PRODUCTS_SUCCESS:
      return { ...state, loading: false, items: action.payload.items, total: action.payload.total };
    case PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case PRODUCT_REQUEST:
      return { ...state, productLoading: true, productError: null, currentProduct: null };
    case PRODUCT_SUCCESS:
      return { ...state, productLoading: false, currentProduct: action.payload };
    case PRODUCT_FAILURE:
      return { ...state, productLoading: false, productError: action.payload };

    case BRANDS_REQUEST:
      return { ...state };
    case BRANDS_SUCCESS:
      return { ...state, brands: action.payload };
    case BRANDS_FAILURE:
      return { ...state };

    case COUNTRIES_REQUEST:
      return { ...state };
    case COUNTRIES_SUCCESS:
      return { ...state, countries: action.payload };
    case COUNTRIES_FAILURE:
      return { ...state };

    default:
      return state;
  }
}
