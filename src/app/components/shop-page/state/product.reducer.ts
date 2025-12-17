import { Action } from '@ngrx/store';
import { ProductState } from './product.state';
import { createReducer, on } from '@ngrx/store';
import { ProductActions } from './product.actions';

const initialProductState: ProductState = {
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialProductState,
  on(ProductActions.loadProducts, (state, { params }) => ({
    ...state,
    loading: true,
    error: null,
    page: params?.page ?? state.page,
    page_size: params?.page_size ?? state.page_size,
    min_rating: params?.min_rating ?? state.min_rating,
    ordering: params?.ordering ?? state.ordering,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products, count, next, previous }) => ({
    ...state,
    products,
    count: count ?? state.count,
    next: next ?? state.next,
    previous: previous ?? state.previous,
    loading: false,
    error: null,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProductActions.loadProductRating, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    ProductActions.loadProductRatingSuccess,
    (state, { product_id, avg_rating, count, ratings }) => ({
      ...state,
      loading: false,
      product_id,
      avg_rating,
      count,
      ratings,
    }),
  ),
  on(ProductActions.loadProductRatingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
