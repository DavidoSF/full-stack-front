import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectAuthAccessToken } from '../components/login-page/state/auth.selectors';
import { first, map } from 'rxjs/operators';

export const alreadyAuthenticatedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  return store.select(selectAuthAccessToken).pipe(
    first(),
    map((token) => {
      if (token) {
        router.navigate(['/shop']);
        return false;
      } else {
        return true;
      }
    }),
  );
};
