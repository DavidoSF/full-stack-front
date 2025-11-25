import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface CartValidationRequest {
  items: { product_id: number; quantity: number }[];
  coupon_code?: string;
}

export interface CartValidationResponse {
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    available: boolean;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
}

export interface OrderRequest {
  items: { product_id: number; quantity: number }[];
  shipping_address: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  total: number;
  coupon_code?: string;
}

export interface OrderResponse {
  order_id: string;
  confirmation_number: string;
  status: string;
  created_at: string;
  estimated_delivery: string;
  total: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  validateCart(request: CartValidationRequest): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>(`${this.apiUrl}/cart/validate/`, request);
  }

  createOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/order/`, request);
  }
}
