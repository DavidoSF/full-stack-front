import { Action } from '@ngrx/store';
import { ProductState } from './product.state';
import { createReducer, on } from '@ngrx/store';

const initialProductState: ProductState = {};

export const productReducer = createReducer(initialProductState);
