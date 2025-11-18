import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token?.access || null,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.token?.access,
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user || null,
);
