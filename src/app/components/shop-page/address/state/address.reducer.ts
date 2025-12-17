import { createReducer, on } from '@ngrx/store';
import { AddressActions } from './address.actions';
import { initialAddressState } from './address.state';

export const addressReducer = createReducer(
  initialAddressState,
  on(AddressActions.addAddress, (state, { address }) => ({
    ...state,
    savedAddresses: [...state.savedAddresses, address],
  })),
  on(AddressActions.updateAddress, (state, { index, address }) => ({
    ...state,
    savedAddresses: state.savedAddresses.map((addr, i) => (i === index ? address : addr)),
  })),
  on(AddressActions.removeAddress, (state, { index }) => ({
    ...state,
    savedAddresses: state.savedAddresses.filter((_, i) => i !== index),
  })),
  on(AddressActions.setDefaultAddress, (state, { address }) => ({
    ...state,
    defaultAddress: address,
  })),
  on(AddressActions.loadAddressesSuccess, (state, { addresses, defaultAddress }) => ({
    ...state,
    savedAddresses: addresses,
    defaultAddress,
  })),
);
