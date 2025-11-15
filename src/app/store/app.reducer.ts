import { ActionReducerMap, combineReducers } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from '../components/shop-page/state/product.reducer';
import { authReducer } from '../components/login-page/state/auth.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  product: productReducer,
  auth: authReducer,
};
