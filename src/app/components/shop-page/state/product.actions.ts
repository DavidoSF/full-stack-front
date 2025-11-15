import { createAction, props } from '@ngrx/store';
import { ProductModel } from '../models/product.model';
import { ErrorResponseModel } from '../../../shared/models/error-response.model';

export class ProductActions {
  static loadProducts = createAction(
    '[Product] Load Products',
    props<{
      params?: { page?: number; page_size?: number; min_rating?: number; ordering?: string };
    }>(),
  );
  static loadProductsSuccess = createAction(
    '[Product] Load Products Success',
    props<{
      products: ProductModel[];
      count?: number;
      next?: string | null;
      previous?: string | null;
    }>(),
  );
  static loadProductsFailure = createAction(
    '[Product] Load Products Failure',
    props<{ error: ErrorResponseModel }>(),
  );

  static loadProductRating = createAction('[ProductRating] Load', props<{ id: number }>());
  static loadProductRatingSuccess = createAction(
    '[ProductRating] Load Success',
    props<{ product_id: number; avg_rating: number; count: number }>(),
  );
  static loadProductRatingFailure = createAction(
    '[ProductRating] Load Failure',
    props<{ error: any }>(),
  );
}
