import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UpdateUserRequest, OrderSummary } from './user.model';
import { Order } from '../../components/shop-page/models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me/`);
  }

  updateUser(updates: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me/`, updates);
  }

  getUserOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/me/orders/`);
  }

  getOrderDetails(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/`);
  }

  getWishlist(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/me/wishlist/`);
  }

  updateWishlist(productId: string, action: 'add' | 'remove'): Observable<{ wishlist: string[] }> {
    return this.http.post<{ wishlist: string[] }>(`${this.apiUrl}/me/wishlist/`, {
      productId,
      action,
    });
  }
}
