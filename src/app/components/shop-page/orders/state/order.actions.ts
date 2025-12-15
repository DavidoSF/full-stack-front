import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export class OrderActions {
  static clearCurrentOrder = createAction('[Order] Clear Current Order');
  static createOrder = createAction('[Order] Create Order', props<{ order: Order }>());
  static createOrderSuccess = createAction(
    '[Order] Create Order Success',
    props<{ order: Order }>(),
  );
  static createOrderFailure = createAction(
    '[Order] Create Order Failure',
    props<{ error: string }>(),
  );
  static loadOrders = createAction('[Order] Load Orders');
  static loadOrdersSuccess = createAction(
    '[Order] Load Orders Success',
    props<{ orders: Order[] }>(),
  );
  static loadOrdersFailure = createAction(
    '[Order] Load Orders Failure',
    props<{ error: string }>(),
  );
  static cancelOrder = createAction('[Order] Cancel Order', props<{ orderId: string }>());
  static cancelOrderSuccess = createAction(
    '[Order] Cancel Order Success',
    props<{ orderId: string }>(),
  );
}
