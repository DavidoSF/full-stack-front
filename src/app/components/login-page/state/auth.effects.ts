import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.request).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
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
          let message = 'Login failed. Please try again.';
          try {
            const err = (action as any).error;
            if (err && typeof err === 'object') {
              if (err.message) message = err.message;
              else if (err.error && err.error.message) message = err.error.message;
            } else if (typeof err === 'string') {
              message = err;
            }
          } catch (e) {}

          this.snackBar.open(message, 'Close', { duration: 5000 });
        }),
      ),
    { dispatch: false },
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
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
}
