import { createAction, props } from '@ngrx/store';
import { Address } from '../../models/address.model';

export class AddressActions {
  static addAddress = createAction('[Address] Add Address', props<{ address: Address }>());

  static updateAddress = createAction(
    '[Address] Update Address',
    props<{ index: number; address: Address }>(),
  );

  static removeAddress = createAction('[Address] Remove Address', props<{ index: number }>());

  static setDefaultAddress = createAction(
    '[Address] Set Default Address',
    props<{ index: number; address: Address }>(),
  );

  static loadAddresses = createAction('[Address] Load Addresses');

  static loadAddressesSuccess = createAction(
    '[Address] Load Addresses Success',
    props<{ addresses: Address[]; defaultAddress: Address | null }>(),
  );
}
