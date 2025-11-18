import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectAllProducts = createSelector(selectProductState, (state) => state.products);

export const selectProductsCount = createSelector(selectProductState, (state) => state.count);
export const selectProductsNext = createSelector(selectProductState, (state) => state.next);
export const selectProductsPrevious = createSelector(selectProductState, (state) => state.previous);

export const selectProductRatingLoading = createSelector(selectProductState, (s) => s?.loading);
export const selectProductRatingError = createSelector(selectProductState, (s) => s?.error);
export const selectProductRatingSummary = createSelector(selectProductState, (s) => ({
  product_id: s?.product_id,
  avg_rating: s?.avg_rating,
  count: s?.count,
  ratings: s?.ratings || [],
}));
