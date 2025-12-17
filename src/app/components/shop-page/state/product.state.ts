import { ProductModel } from '../models/product.model';
import { ProductRatingModel } from '../models/product-rating.model';

export interface ProductState {
  products?: ProductModel[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  page?: number;
  page_size?: number;
  min_rating?: number;
  ordering?: string;

  loading?: boolean;
  error?: any;
  product_id?: number;
  avg_rating?: number;
  ratings?: ProductRatingModel[];
}
