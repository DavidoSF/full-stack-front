import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, (state) => state.items);

export const selectCartTotal = createSelector(selectCartState, (state) => state.totalPrice);

export const selectCartCount = createSelector(selectCartState, (state) => state.count);

export const selectCartLoading = createSelector(selectCartState, (state) => state.loading);

export const selectCartError = createSelector(selectCartState, (state) => state.error);

export const selectCartSubtotal = createSelector(selectCartState, (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartDiscount = createSelector(selectCartState, (state) => state.discount || 0);

export const selectCartCouponCode = createSelector(selectCartState, (state) => state.couponCode);

export const selectCartItemByProductId = (productId: number) =>
  createSelector(selectCartItems, (items) => items.find((item) => item.productId === productId));
