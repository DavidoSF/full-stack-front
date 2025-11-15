import { ProductModel } from '../models/product.model';

export interface ProductState {
  products?: ProductModel[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  page?: number;
  page_size?: number;
}
