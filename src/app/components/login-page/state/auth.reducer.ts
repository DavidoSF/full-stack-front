import { Action } from '@ngrx/store';
import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.state';
import { AuthActions } from './auth.actions';

const initialAuthState: AuthState = {};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    token: {
      access: response.access,
      refresh: response.refresh,
    },
    user: response.user,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: undefined,
    user: undefined,
  })),
  on(AuthActions.loadAuthFromStorageSuccess, (state, { response }) => ({
    ...state,
    token: {
      access: response.access,
      refresh: response.refresh,
    },
    user: response.user,
  })),
);
