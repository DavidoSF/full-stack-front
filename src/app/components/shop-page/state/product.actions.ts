import { createAction, props } from '@ngrx/store';

export class ProductActions {
  static loadProducts = createAction('[Product] Load Products');
  static loadProductsSuccess = createAction(
    '[Product] Load Products Success',
    props<{ products: any[] }>(),
  );
  static loadProductsFailure = createAction(
    '[Product] Load Products Failure',
    props<{ error: any }>(),
  );
}
