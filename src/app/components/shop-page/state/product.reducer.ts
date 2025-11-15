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
);
