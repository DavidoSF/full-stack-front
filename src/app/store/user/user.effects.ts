import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UserActions } from './user.actions';
import { UserService } from './user.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);

  constructor(private userService: UserService) {}

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
          this.notificationService.success('Profile updated successfully!');
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
          this.notificationService.error(error);
        }),
      ),
    { dispatch: false },
  );
}
