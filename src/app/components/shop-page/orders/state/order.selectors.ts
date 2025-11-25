import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectAllOrders = createSelector(selectOrderState, (state) => state.orders);

export const selectCurrentOrder = createSelector(selectOrderState, (state) => state.currentOrder);

export const selectOrderLoading = createSelector(selectOrderState, (state) => state.loading);

export const selectOrderError = createSelector(selectOrderState, (state) => state.error);
