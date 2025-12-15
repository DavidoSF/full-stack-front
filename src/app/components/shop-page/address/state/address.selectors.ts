import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressState } from './address.state';

export const selectAddressState = createFeatureSelector<AddressState>('address');

export const selectSavedAddresses = createSelector(
  selectAddressState,
  (state) => state.savedAddresses,
);

export const selectDefaultAddress = createSelector(
  selectAddressState,
  (state) => state.defaultAddress,
);

export const selectAddressLoading = createSelector(selectAddressState, (state) => state.loading);
