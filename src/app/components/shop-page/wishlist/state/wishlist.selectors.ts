import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.state';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(selectWishlistState, (state) => state.items);

export const selectWishlistCount = createSelector(
  selectWishlistState,
  (state) => state.items.length,
);

export const selectWishlistLoading = createSelector(selectWishlistState, (state) => state.loading);

export const selectWishlistError = createSelector(selectWishlistState, (state) => state.error);

export const selectIsInWishlist = (productId: number) =>
  createSelector(selectWishlistItems, (items) =>
    items.some((item) => item.productId === productId),
  );
