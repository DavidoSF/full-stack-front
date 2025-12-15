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

export const selectPromoCode = createSelector(selectCartState, (state) => state.promoCode);

export const selectPromoDiscount = createSelector(
  selectCartState,
  (state) => state.promoDiscount || 0,
);

export const selectShipping = createSelector(selectCartState, (state) => state.shipping || 0);

export const selectTaxes = createSelector(selectCartState, (state) => state.taxes || 0);

export const selectAppliedPromos = createSelector(
  selectCartState,
  (state) => state.appliedPromos || [],
);

export const selectHasPromoApplied = createSelector(
  selectAppliedPromos,
  (promos) => promos.length > 0,
);

export const selectCartPageTotal = createSelector(
  selectCartSubtotal,
  selectCartDiscount,
  (subtotal, discount) => {
    const discountAmount = discount ? subtotal * (discount / 100) : 0;
    return Number((subtotal - discountAmount).toFixed(2));
  },
);
