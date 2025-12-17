import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ReviewsActions } from './reviews.actions';
import { environment } from '../../../../../environments/environment';
import { ProductReview } from '../../models/product-review.model';
import { ProductActions } from '../../state/product.actions';
import { NotificationService } from '../../../../shared/services/notification.service';

@Injectable()
export class ReviewsEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      switchMap(({ productId }) =>
        this.http.get<ProductReview[]>(`${environment.apiUrl}/products/${productId}/reviews/`).pipe(
          map((reviews) => ReviewsActions.loadReviewsSuccess({ reviews, productId })),
          catchError((error) => of(ReviewsActions.loadReviewsFailure({ error }))),
        ),
      ),
    ),
  );

  submitReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.submitReview),
      switchMap(({ productId, rating, comment }) =>
        this.http
          .post<ProductReview>(`${environment.apiUrl}/products/${productId}/reviews/`, {
            rating,
            comment,
          })
          .pipe(
            switchMap((review) => {
              return [
                ReviewsActions.submitReviewSuccess({ review }),
                ReviewsActions.loadReviews({ productId }),
                ProductActions.loadProductRating({ id: productId }),
                ProductActions.loadProducts({ params: {} }),
              ];
            }),
            catchError((error) => of(ReviewsActions.submitReviewFailure({ error }))),
          ),
      ),
    ),
  );

  submitReviewSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReviewsActions.submitReviewSuccess),
        tap(() => {
          this.notificationService.success('Review submitted successfully!');
        }),
      ),
    { dispatch: false },
  );

  submitReviewFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReviewsActions.submitReviewFailure),
        tap(({ error }) => {
          const message =
            error?.error?.message || error?.message || 'Failed to submit review. Please try again.';
          this.notificationService.error(message);
        }),
      ),
    { dispatch: false },
  );
}
