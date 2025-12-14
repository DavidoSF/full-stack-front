import { createAction, props } from '@ngrx/store';
import { ProductReview } from '../../models/product-review.model';

export class ReviewsActions {
  static loadReviews = createAction('[Reviews] Load Reviews', props<{ productId: number }>());

  static loadReviewsSuccess = createAction(
    '[Reviews] Load Reviews Success',
    props<{ reviews: ProductReview[]; productId: number }>(),
  );

  static loadReviewsFailure = createAction(
    '[Reviews] Load Reviews Failure',
    props<{ error: any }>(),
  );

  static submitReview = createAction(
    '[Reviews] Submit Review',
    props<{ productId: number; rating: number; comment: string }>(),
  );

  static submitReviewSuccess = createAction(
    '[Reviews] Submit Review Success',
    props<{ review: ProductReview }>(),
  );

  static submitReviewFailure = createAction(
    '[Reviews] Submit Review Failure',
    props<{ error: any }>(),
  );

  static setFilterRating = createAction(
    '[Reviews] Set Filter Rating',
    props<{ rating: number | null }>(),
  );

  static setSortBy = createAction(
    '[Reviews] Set Sort By',
    props<{ sortBy: 'recent' | 'highest' | 'lowest' }>(),
  );
}
