import { Address } from '../../models/address.model';

export interface AddressState {
  savedAddresses: Address[];
  defaultAddress: Address | null;
  loading: boolean;
  error: string | null;
}

export const initialAddressState: AddressState = {
  savedAddresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
};
