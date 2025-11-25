import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectCartItems } from './cart.selectors';
import { CartItem } from '../../models/cart-item.model';
import { CartActions } from './cart.actions';

@Injectable()
export class CartEffects {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private actions$ = inject(Actions);
  private store = inject(Store);
  saveCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addItem,
          CartActions.removeItem,
          CartActions.updateQuantity,
          CartActions.clearCart,
          CartActions.applyCouponSuccess,
        ),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([, items]) => {
          try {
            localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
          } catch (error) {
            console.error('Failed to save cart to localStorage', error);
          }
        }),
      ),
    { dispatch: false },
  );

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        try {
          const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
          if (cartData) {
            const items: CartItem[] = JSON.parse(cartData);
            return CartActions.loadCartSuccess({ items });
          }
          return CartActions.loadCartSuccess({ items: [] });
        } catch (error) {
          return CartActions.loadCartFailure({ error: 'Failed to load cart from storage' });
        }
      }),
      catchError((error) => of(CartActions.loadCartFailure({ error: error.message }))),
    ),
  );

  applyCoupon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.applyCoupon),
      map(({ couponCode }) => {
        const coupons: Record<string, number> = {
          SAVE10: 10,
          SAVE20: 20,
          WELCOME: 15,
          SUMMER25: 25,
        };

        const discount = coupons[couponCode.toUpperCase()];
        if (discount) {
          return CartActions.applyCouponSuccess({ couponCode, discount });
        }
        return CartActions.applyCouponFailure({ error: 'Invalid coupon code' });
      }),
      catchError((error) => of(CartActions.applyCouponFailure({ error: error.message }))),
    ),
  );

  constructor() {}
}
