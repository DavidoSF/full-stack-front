import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

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

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map((response) => AuthActions.refreshTokenSuccess({ response: response.token })),
          catchError((error) => of(AuthActions.refreshTokenFailure({ error }))),
        ),
      ),
      catchError((error) => of(AuthActions.refreshTokenFailure({ error }))),
    ),
  );
}
