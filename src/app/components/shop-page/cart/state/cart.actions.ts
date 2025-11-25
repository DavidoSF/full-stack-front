import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cart-item.model';

export class CartActions {
  static addItem = createAction(
    '[Cart] Add Item',
    props<{
      product: { id: number; name: string; price: number; imageUrl?: string; stock?: number };
      quantity: number;
    }>(),
  );

  static addItemSuccess = createAction('[Cart] Add Item Success');
  static addItemFailure = createAction('[Cart] Add Item Failure', props<{ error: string }>());
  static removeItem = createAction('[Cart] Remove Item', props<{ productId: number }>());

  static updateQuantity = createAction(
    '[Cart] Update Quantity',
    props<{ productId: number; quantity: number }>(),
  );
  static clearCart = createAction('[Cart] Clear Cart');
  static loadCart = createAction('[Cart] Load Cart');

  static loadCartSuccess = createAction('[Cart] Load Cart Success', props<{ items: CartItem[] }>());
  static loadCartFailure = createAction('[Cart] Load Cart Failure', props<{ error: string }>());

  static applyCoupon = createAction('[Cart] Apply Coupon', props<{ couponCode: string }>());

  static applyCouponSuccess = createAction(
    '[Cart] Apply Coupon Success',
    props<{ couponCode: string; discount: number }>(),
  );
  static applyCouponFailure = createAction(
    '[Cart] Apply Coupon Failure',
    props<{ error: string }>(),
  );
}
