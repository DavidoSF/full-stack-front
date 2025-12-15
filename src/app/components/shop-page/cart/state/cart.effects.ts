import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, catchError, withLatestFrom, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { selectCartItems } from './cart.selectors';
import { CartItem } from '../../models/cart-item.model';
import { CartActions } from './cart.actions';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class CartEffects {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private actions$ = inject(Actions);
  private store = inject(Store);
  private http = inject(HttpClient);
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

  applyPromoCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.applyPromoCode),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([{ promoCode }, items]) => {
        const cartItems = items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        }));

        return this.http
          .post<{
            itemsTotal: number;
            discount: number;
            shipping: number;
            taxes: number;
            grandTotal: number;
            appliedPromos: string[];
          }>(`${environment.apiUrl}/cart/apply-promo/`, {
            items: cartItems,
            promoCode,
          })
          .pipe(
            map((response) =>
              CartActions.applyPromoCodeSuccess({
                promoCode,
                itemsTotal: response.itemsTotal,
                discount: response.discount,
                shipping: response.shipping,
                taxes: response.taxes,
                grandTotal: response.grandTotal,
                appliedPromos: response.appliedPromos,
              }),
            ),
            catchError((error) =>
              of(
                CartActions.applyPromoCodeFailure({
                  error: error.error?.error || 'Failed to apply promo code',
                }),
              ),
            ),
          );
      }),
    ),
  );

  autoApplyPromo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CartActions.addItem,
        CartActions.updateQuantity,
        CartActions.removeItem,
        CartActions.loadCartSuccess,
      ),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([, items]) => {
        if (items.length === 0) {
          return of(CartActions.removePromoCode());
        }

        const cartItems = items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        }));

        return this.http
          .post<{
            itemsTotal: number;
            discount: number;
            shipping: number;
            taxes: number;
            grandTotal: number;
            appliedPromos: string[];
            promoCode: string;
          }>(`${environment.apiUrl}/cart/auto-promo/`, {
            items: cartItems,
          })
          .pipe(
            map((response) =>
              CartActions.autoApplyPromoSuccess({
                promoCode: response.promoCode,
                itemsTotal: response.itemsTotal,
                discount: response.discount,
                shipping: response.shipping,
                taxes: response.taxes,
                grandTotal: response.grandTotal,
                appliedPromos: response.appliedPromos,
              }),
            ),
            catchError(() => of(CartActions.autoApplyPromoFailure({ error: 'Auto-apply failed' }))),
          );
      }),
    ),
  );

  constructor() {}
}
