import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('product');

export const selectAllProducts = createSelector(selectProductState, (state) => state.products);

export const selectProductsCount = createSelector(selectProductState, (state) => state.count);
export const selectProductsNext = createSelector(selectProductState, (state) => state.next);
export const selectProductsPrevious = createSelector(selectProductState, (state) => state.previous);
