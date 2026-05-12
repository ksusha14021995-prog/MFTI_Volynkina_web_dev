import {
  PICKUP_POINTS_REQUEST, PICKUP_POINTS_SUCCESS, PICKUP_POINTS_FAILURE,
  ORDER_CREATE_REQUEST,  ORDER_CREATE_SUCCESS,  ORDER_CREATE_FAILURE,
  ORDER_FETCH_REQUEST,   ORDER_FETCH_SUCCESS,   ORDER_FETCH_FAILURE,
} from '../actionTypes';

const initialState = {
  currentOrder: null,
  loading: false,
  error: null,
  pickupPoints: [],
  pickupLoading: false,
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case PICKUP_POINTS_REQUEST:
      return { ...state, pickupLoading: true };
    case PICKUP_POINTS_SUCCESS:
      return { ...state, pickupLoading: false, pickupPoints: action.payload };
    case PICKUP_POINTS_FAILURE:
      return { ...state, pickupLoading: false };

    case ORDER_CREATE_REQUEST:
    case ORDER_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_CREATE_SUCCESS:
    case ORDER_FETCH_SUCCESS:
      return { ...state, loading: false, currentOrder: action.payload };
    case ORDER_CREATE_FAILURE:
    case ORDER_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
