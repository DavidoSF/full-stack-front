import { Order } from '../../models/order.model';

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export const initialOrderState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};
