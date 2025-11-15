import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token?.access || null,
);
