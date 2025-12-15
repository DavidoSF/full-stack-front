import { ProductRatingModel } from './product-rating.model';

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  ratings: ProductRatingModel[];
  _avg: number;
  stock: number;
  lowStockThreshold: number;
  promo?: {
    type: 'percentage' | 'free_shipping';
    value?: number;
    label: string;
  };
}
