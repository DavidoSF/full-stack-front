import { Address } from '../../components/shop-page/models/address.model';

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface OrderSummary {
  orderId: string;
  confirmationNumber: string;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
  orders: OrderSummary[];
}

export interface UpdateUserRequest {
  fullName?: string;
  preferences?: Partial<UserPreferences>;
  defaultAddress?: Address;
}
