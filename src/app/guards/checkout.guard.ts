import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, take } from 'rxjs/operators';
import { selectCartItems } from '../components/shop-page/cart/state/cart.selectors';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return store.select(selectCartItems).pipe(
    take(1),
    map((items) => {
      if (items.length === 0) {
        console.warn('Checkout blocked: Cart is empty');
        snackBar.open('Your cart is empty. Add items before checkout.', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        router.navigate(['/shop/cart']);
        return false;
      }
      return true;
    }),
  );
};
