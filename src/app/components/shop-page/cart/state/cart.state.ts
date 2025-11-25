import { Cart } from '../../models/cart.model';

export interface CartState extends Cart {
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  count: 0,
  loading: false,
  error: null,
};
