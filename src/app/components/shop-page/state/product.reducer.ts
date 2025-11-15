import { Action } from '@ngrx/store';
import { ProductState } from './product.state';
import { createReducer, on } from '@ngrx/store';
import { ProductActions } from './product.actions';

const initialProductState: ProductState = {};

export const productReducer = createReducer(
  initialProductState,
  on(ProductActions.loadProductsSuccess, (state, { products, count, next, previous }) => ({
    ...state,
    products,
    count: count ?? state.count,
    next: next ?? state.next,
    previous: previous ?? state.previous,
  })),
  on(ProductActions.loadProductRating, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(ProductActions.loadProductRatingSuccess, (state, { product_id, avg_rating, count }) => ({
    ...state,
    loading: false,
    product_id,
    avg_rating,
    count,
  })),
  on(ProductActions.loadProductRatingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
