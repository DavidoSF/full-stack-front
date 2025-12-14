import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, (state) => state.user);

export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);

export const selectUserError = createSelector(selectUserState, (state) => state.error);

export const selectUserPreferences = createSelector(selectUser, (user) => user?.preferences);

export const selectUserOrders = createSelector(selectUser, (user) => user?.orders || []);

export const selectUserDefaultAddress = createSelector(selectUser, (user) => user?.defaultAddress);

export const selectUserFullName = createSelector(
  selectUser,
  (user) => user?.fullName || user?.username || 'User',
);

export const selectIsLoggedIn = createSelector(selectUser, (user) => !!user);
