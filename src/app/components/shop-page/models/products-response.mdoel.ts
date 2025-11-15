import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { ProductModel } from './product.model';

export interface ListProductsResponse extends CommonResponseModel {
  count: number;
  results: ProductModel[];
  next: string | null;
  previous: string | null;
}
