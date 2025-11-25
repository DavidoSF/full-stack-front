import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AddressActions } from './address.actions';

@Injectable()
export class AddressEffects {
  saveAddressesToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AddressActions.addAddress,
          AddressActions.updateAddress,
          AddressActions.removeAddress,
          AddressActions.setDefaultAddress,
        ),
        tap((action) => {
          const addresses = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
          const defaultAddress = JSON.parse(localStorage.getItem('default_address') || 'null');

          if (action.type === '[Address] Add Address') {
            addresses.push((action as any).address);
            localStorage.setItem('saved_addresses', JSON.stringify(addresses));
          } else if (action.type === '[Address] Update Address') {
            const { index, address } = action as any;
            addresses[index] = address;
            localStorage.setItem('saved_addresses', JSON.stringify(addresses));
          } else if (action.type === '[Address] Remove Address') {
            const { index } = action as any;
            addresses.splice(index, 1);
            localStorage.setItem('saved_addresses', JSON.stringify(addresses));
          } else if (action.type === '[Address] Set Default Address') {
            localStorage.setItem('default_address', JSON.stringify((action as any).address));
          }
        }),
      ),
    { dispatch: false },
  );

  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddresses),
      map(() => {
        const addresses = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
        const defaultAddress = JSON.parse(localStorage.getItem('default_address') || 'null');
        return AddressActions.loadAddressesSuccess({ addresses, defaultAddress });
      }),
      catchError(() =>
        of(AddressActions.loadAddressesSuccess({ addresses: [], defaultAddress: null })),
      ),
    ),
  );

  constructor(private actions$: Actions) {}
}
