import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCartItems } from '../components/shop-page/cart/state/cart.selectors';
import { NotificationService } from '../shared/services/notification.service';

export const checkoutAddressGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return store.select(selectCartItems).pipe(
    take(1),
    map((items) => {
      if (items.length === 0) {
        console.warn('Checkout address blocked: Cart is empty');
        notificationService.warning('Your cart is empty. Add items before checkout.');
        router.navigate(['/shop/cart']);
        return false;
      }
      return true;
    }),
  );
};
