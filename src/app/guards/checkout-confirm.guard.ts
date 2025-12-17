import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCartItems } from '../components/shop-page/cart/state/cart.selectors';
import { NotificationService } from '../shared/services/notification.service';

export const checkoutConfirmGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return store.select(selectCartItems).pipe(
    take(1),
    map((items) => {
      if (items.length === 0) {
        console.warn('Checkout confirmation blocked: Cart is empty');
        notificationService.warning('Your cart is empty. Add items before checkout.');
        router.navigate(['/shop/cart']);
        return false;
      }

      const addressData = localStorage.getItem('checkout_address');
      if (!addressData) {
        console.warn('Checkout confirmation blocked: Address is missing');
        notificationService.warning('Please provide a delivery address first.');
        router.navigate(['/shop/checkout/address']);
        return false;
      }

      try {
        const address = JSON.parse(addressData);
        const requiredFields = [
          'firstName',
          'lastName',
          'email',
          'phone',
          'street',
          'city',
          'postalCode',
          'country',
        ];

        const missingFields = requiredFields.filter((field) => !address[field]);

        if (missingFields.length > 0) {
          console.warn(
            `Checkout confirmation blocked: Missing required address fields: ${missingFields.join(', ')}`,
          );
          notificationService.warning('Please complete all required address fields.');
          router.navigate(['/shop/checkout/address']);
          return false;
        }
      } catch (error) {
        console.error('Error parsing address data:', error);
        notificationService.error('Invalid address data. Please re-enter your address.');
        router.navigate(['/shop/checkout/address']);
        return false;
      }

      return true;
    }),
  );
};
