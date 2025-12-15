import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { OrderActions } from './order.actions';
import { CartService, OrderRequest } from '../../cart/services/cart.service';
import { StockValidationService } from '../../cart/services/stock-validation.service';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private stockValidationService = inject(StockValidationService);
  private http = inject(HttpClient);

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(({ order }) => {
        const items = order.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        }));

        return this.stockValidationService.validateStock(items).pipe(
          switchMap((validationResponse) => {
            if (validationResponse.error) {
              return of(OrderActions.createOrderFailure({ error: validationResponse.error }));
            }

            const orderRequest: OrderRequest = {
              items: items,
              shipping_address: {
                first_name: order.shippingAddress.firstName,
                last_name: order.shippingAddress.lastName,
                email: order.shippingAddress.email,
                phone: order.shippingAddress.phone,
                street: order.shippingAddress.street,
                city: order.shippingAddress.city,
                postal_code: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
              },
              subtotal: order.subtotal,
              shipping: order.shipping,
              tax: order.tax,
              total: order.total,
              discount: order.discount,
              coupon_code: order.couponCode,
              promo_code: order.promoCode,
              promo_discount: order.promoDiscount,
              applied_promos: order.appliedPromos,
            };

            return this.cartService.createOrder(orderRequest).pipe(
              map((response) =>
                OrderActions.createOrderSuccess({
                  order: {
                    ...order,
                    orderId: response.order_id,
                    confirmationNumber: response.confirmation_number,
                    status: response.status,
                    createdAt: response.created_at,
                    estimatedDelivery: response.estimated_delivery,
                  },
                }),
              ),
              catchError((error) => of(OrderActions.createOrderFailure({ error: error.message }))),
            );
          }),
          catchError((error) => {
            const errorMessage = error?.error?.error || error?.message || 'Stock validation failed';
            return of(OrderActions.createOrderFailure({ error: errorMessage }));
          }),
        );
      }),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap(() =>
        this.http.get<any[]>(`${environment.apiUrl}/me/orders/`).pipe(
          map((orders) => OrderActions.loadOrdersSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  cancelOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.cancelOrder),
      switchMap(({ orderId }) =>
        this.http.delete(`${environment.apiUrl}/orders/${orderId}/`).pipe(
          map(() => OrderActions.cancelOrderSuccess({ orderId })),
          catchError((error) => of(OrderActions.createOrderFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  constructor() {}
}
