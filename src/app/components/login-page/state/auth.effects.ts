import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.request).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              response: {
                access: response.access,
                refresh: response.refresh,
                user: response.user || {
                  username: action.request.username,
                  email: '',
                  fullName: '',
                },
              },
            }),
          ),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
      catchError((error) => of(AuthActions.loginFailure({ error }))),
    ),
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap((action) => {
          let message = 'Login failed. Please check your credentials and try again.';
          try {
            const err = (action as any).error;
            if (err && typeof err === 'object') {
              if (err.status === 401) {
                message = 'Invalid username or password.';
              } else if (err.status === 429) {
                message = 'Too many login attempts. Please try again later.';
              } else if (err.message) {
                message = err.message;
              } else if (err.error && err.error.message) {
                message = err.error.message;
              } else if (err.error && err.error.detail) {
                message = err.error.detail;
              }
            } else if (typeof err === 'string') {
              message = err;
            }
          } catch (e) {}

          this.notificationService.error(message);
        }),
      ),
    { dispatch: false },
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          localStorage.setItem('auth_state', JSON.stringify(action.response));
          this.router.navigate(['/shop']);
        }),
      ),
    { dispatch: false },
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map((response) =>
            AuthActions.refreshTokenSuccess({
              response: {
                access: response.access,
                refresh: response.refresh,
              },
            }),
          ),
          catchError((error) => of(AuthActions.refreshTokenFailure({ error }))),
        ),
      ),
      catchError((error) => of(AuthActions.refreshTokenFailure({ error }))),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('auth_state');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );

  loadAuthFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthFromStorage),
      switchMap(() => {
        const authData = localStorage.getItem('auth_state');
        if (authData) {
          const storedAuth = JSON.parse(authData);
          return this.authService.getCurrentUser().pipe(
            map((user) =>
              AuthActions.loadAuthFromStorageSuccess({
                response: {
                  access: storedAuth.access,
                  refresh: storedAuth.refresh,
                  user: user,
                },
              }),
            ),
            catchError(() => {
              return of(AuthActions.loadAuthFromStorageSuccess({ response: storedAuth }));
            }),
          );
        }
        return of({ type: '[Auth] No Stored Auth' });
      }),
      catchError(() => of({ type: '[Auth] Load Storage Failed' })),
    ),
  );
}
