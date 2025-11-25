import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListProductsResponse } from '../models/products-response.mdoel';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/api/products/';

  getProducts(params?: {
    page?: number;
    page_size?: number;
    min_rating?: number;
    ordering?: string;
  }): Observable<ListProductsResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .forEach(([k, v]) => (httpParams = httpParams.set(k, String(v))));
    }

    return this.http.get<ListProductsResponse>(this.apiUrl, { params: httpParams });
  }

  getProductRating(id: number) {
    const url = `${this.apiUrl}${id}/rating/`;
    return this.http.get<{ product_id: number; avg_rating: number; count: number }>(url);
  }
}
