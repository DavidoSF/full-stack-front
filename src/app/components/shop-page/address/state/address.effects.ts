import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AddressActions } from './address.actions';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class AddressEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // Add address via API
  addAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.addAddress),
      switchMap((action) =>
        this.http.post<any>(`${environment.apiUrl}/me/addresses/`, action.address).pipe(
          map(() => AddressActions.loadAddresses()),
          catchError(() => of({ type: '[Address] Add Failed' })),
        ),
      ),
    ),
  );

  // Update address via API
  updateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateAddress),
      switchMap((action) =>
        this.http
          .put<any>(`${environment.apiUrl}/me/addresses/${action.index}/`, action.address)
          .pipe(
            map(() => AddressActions.loadAddresses()),
            catchError(() => of({ type: '[Address] Update Failed' })),
          ),
      ),
    ),
  );

  // Remove address via API
  removeAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.removeAddress),
      switchMap((action) =>
        this.http.delete<any>(`${environment.apiUrl}/me/addresses/${action.index}/`).pipe(
          map(() => AddressActions.loadAddresses()),
          catchError(() => of({ type: '[Address] Remove Failed' })),
        ),
      ),
    ),
  );

  // Set default address via API
  setDefaultAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.setDefaultAddress),
      switchMap((action) =>
        this.http
          .patch<any>(`${environment.apiUrl}/me/addresses/default/`, {
            index: (action as any).index,
          })
          .pipe(
            map(() => AddressActions.loadAddresses()),
            catchError(() => of({ type: '[Address] Set Default Failed' })),
          ),
      ),
    ),
  );

  // Load addresses from API
  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddresses),
      switchMap(() =>
        this.http.get<any>(`${environment.apiUrl}/me/addresses/`).pipe(
          map((response) =>
            AddressActions.loadAddressesSuccess({
              addresses: response.addresses || [],
              defaultAddress: response.defaultAddress || null,
            }),
          ),
          catchError(() =>
            of(AddressActions.loadAddressesSuccess({ addresses: [], defaultAddress: null })),
          ),
        ),
      ),
    ),
  );
}
