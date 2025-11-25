import { createReducer, on } from '@ngrx/store';
import { OrderActions } from './order.actions';
import { initialOrderState } from './order.state';

export const orderReducer = createReducer(
  initialOrderState,
  on(OrderActions.createOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.createOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [order, ...state.orders],
    currentOrder: order,
    loading: false,
    error: null,
  })),
  on(OrderActions.createOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
    error: null,
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(OrderActions.clearCurrentOrder, (state) => ({
    ...state,
    currentOrder: null,
  })),
  on(OrderActions.cancelOrder, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrderActions.cancelOrderSuccess, (state, { orderId }) => ({
    ...state,
    orders: state.orders.filter((order) => order.orderId !== orderId),
    loading: false,
  })),
);
