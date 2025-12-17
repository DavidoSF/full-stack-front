import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs';
import { AppState } from '../store/app.state';
import { selectAuthAccessToken } from '../components/login-page/state/auth.selectors';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<AppState>);

  return store.select(selectAuthAccessToken).pipe(
    first(),
    switchMap((token) => {
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(cloned);
      }
      return next(req);
    }),
  );
};
