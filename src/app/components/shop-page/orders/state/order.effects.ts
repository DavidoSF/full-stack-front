import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { OrderActions } from './order.actions';
import { CartService, OrderRequest } from '../../cart/services/cart.service';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      switchMap(({ order }) => {
        const orderRequest: OrderRequest = {
          items: order.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
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
          total: order.total,
          coupon_code: order.couponCode,
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
    ),
  );

  saveOrderToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrderActions.createOrderSuccess),
        tap(({ order }) => {
          const existingOrders = JSON.parse(localStorage.getItem('shopping_orders') || '[]');
          const updatedOrders = [order, ...existingOrders];
          localStorage.setItem('shopping_orders', JSON.stringify(updatedOrders));
        }),
      ),
    { dispatch: false },
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      map(() => {
        const orders = JSON.parse(localStorage.getItem('shopping_orders') || '[]');
        return OrderActions.loadOrdersSuccess({ orders });
      }),
      catchError((error) => of(OrderActions.loadOrdersFailure({ error: error.message }))),
    ),
  );

  cancelOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.cancelOrder),
      map(({ orderId }) => {
        const orders = JSON.parse(localStorage.getItem('shopping_orders') || '[]');
        const updatedOrders = orders.filter((order: any) => order.orderId !== orderId);
        localStorage.setItem('shopping_orders', JSON.stringify(updatedOrders));
        return OrderActions.cancelOrderSuccess({ orderId });
      }),
      catchError((error) => of(OrderActions.createOrderFailure({ error: error.message }))),
    ),
  );

  constructor() {}
}
