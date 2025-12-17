import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { ProductActions } from './product.actions';
import { ProductService } from '../services/product.service';
import { catchError, switchMap, map, of, tap } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);

  constructor() {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap((action: any) =>
        this.productService.getProducts(action.params).pipe(
          map((response) =>
            ProductActions.loadProductsSuccess({
              products: response.results,
              count: response.count,
              next: response.next,
              previous: response.previous,
            }),
          ),
          catchError((error) => of(ProductActions.loadProductsFailure({ error }))),
        ),
      ),
      catchError((error) => of(ProductActions.loadProductsFailure({ error }))),
    ),
  );

  loadProductRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductRating),
      switchMap((action: any) =>
        this.productService.getProductRating(action.id).pipe(
          map((res: any) =>
            ProductActions.loadProductRatingSuccess({
              product_id: res.product_id,
              avg_rating: res.avg_rating,
              count: res.count,
              ratings: res.ratings || [],
            }),
          ),
          catchError((error) => of(ProductActions.loadProductRatingFailure({ error }))),
        ),
      ),
    ),
  );

  loadProductsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductActions.loadProductsFailure),
        tap(() => {
          this.notificationService.error('Failed to load products. Please try again.');
        }),
      ),
    { dispatch: false },
  );
}
