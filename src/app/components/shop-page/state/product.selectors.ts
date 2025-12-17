import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectAllProducts = createSelector(selectProductState, (state) => state.products);

export const selectProductsCount = createSelector(selectProductState, (state) => state.count);
export const selectProductsNext = createSelector(selectProductState, (state) => state.next);
export const selectProductsPrevious = createSelector(selectProductState, (state) => state.previous);

export const selectProductsLoading = createSelector(selectProductState, (state) => state.loading);
export const selectProductsError = createSelector(selectProductState, (state) => state.error);

export const selectProductsPage = createSelector(selectProductState, (state) => state.page);
export const selectProductsPageSize = createSelector(
  selectProductState,
  (state) => state.page_size,
);
export const selectProductsMinRating = createSelector(
  selectProductState,
  (state) => state.min_rating,
);
export const selectProductsOrdering = createSelector(selectProductState, (state) => state.ordering);

export const selectProductRatingLoading = createSelector(selectProductState, (s) => s?.loading);
export const selectProductRatingError = createSelector(selectProductState, (s) => s?.error);
export const selectProductRatingSummary = createSelector(selectProductState, (s) => ({
  product_id: s?.product_id,
  avg_rating: s?.avg_rating,
  count: s?.count,
  ratings: s?.ratings || [],
}));
