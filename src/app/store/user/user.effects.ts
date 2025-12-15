import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UserActions } from './user.actions';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(() =>
        this.userService.getUser().pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.loadUserFailure({ error: error.message || 'Failed to load user' })),
          ),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ updates }) =>
        this.userService.updateUser(updates).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message || 'Failed to update user' })),
          ),
        ),
      ),
    ),
  );

  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.updateUserSuccess),
        tap(() => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }),
      ),
    { dispatch: false },
  );

  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserOrders),
      switchMap(() =>
        this.userService.getUserOrders().pipe(
          map((orders) => UserActions.loadUserOrdersSuccess({ orders })),
          catchError((error) =>
            of(
              UserActions.loadUserOrdersFailure({
                error: error.message || 'Failed to load orders',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          UserActions.updateUserFailure,
          UserActions.loadUserFailure,
          UserActions.loadUserOrdersFailure,
        ),
        tap(({ error }) => {
          this.snackBar.open(error, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }),
      ),
    { dispatch: false },
  );
}
