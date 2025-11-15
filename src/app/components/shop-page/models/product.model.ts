import { ProductRatingModel } from './product-rating.model';

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  ratings: ProductRatingModel[];
  _avg: number;
}
