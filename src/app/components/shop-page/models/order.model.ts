import { CartItem } from './cart-item.model';
import { Address } from './address.model';

export interface Order {
  orderId?: string;
  confirmationNumber?: string;
  items: CartItem[];
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  discount?: number;
  promoCode?: string;
  promoDiscount?: number;
  appliedPromos?: string[];
  status?: string;
  createdAt?: string;
  estimatedDelivery?: string;
}
