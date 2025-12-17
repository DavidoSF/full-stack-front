import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProductDetails } from '../models/product-details.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getProductDetails(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.apiUrl}/products/${id}/`);
  }
}
