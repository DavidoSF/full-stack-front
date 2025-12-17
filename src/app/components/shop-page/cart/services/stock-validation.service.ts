import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface StockValidationRequest {
  items: { product_id: number; quantity: number }[];
}

export interface StockValidationResponse {
  message?: string;
  error?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StockValidationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  validateStock(
    items: { product_id: number; quantity: number }[],
  ): Observable<StockValidationResponse> {
    return this.http.post<StockValidationResponse>(`${this.apiUrl}/cart/validate-stock/`, {
      items,
    });
  }
}
