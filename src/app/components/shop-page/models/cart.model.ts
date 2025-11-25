import { CartItem } from './cart-item.model';

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  count: number;
  couponCode?: string;
  discount?: number;
}
