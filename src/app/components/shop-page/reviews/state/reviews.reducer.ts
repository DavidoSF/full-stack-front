import { createReducer, on } from '@ngrx/store';
import { ReviewsActions } from './reviews.actions';
import { initialReviewsState } from './reviews.state';

export const reviewsReducer = createReducer(
  initialReviewsState,
  on(ReviewsActions.loadReviews, (state, { productId }) => ({
    ...state,
    loading: true,
    error: null,
    currentProductId: productId,
  })),
  on(ReviewsActions.loadReviewsSuccess, (state, { reviews, productId }) => ({
    ...state,
    reviews,
    loading: false,
    currentProductId: productId,
  })),
  on(ReviewsActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ReviewsActions.submitReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReviewsActions.submitReviewSuccess, (state, { review }) => ({
    ...state,
    reviews: [review, ...state.reviews],
    loading: false,
  })),
  on(ReviewsActions.submitReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ReviewsActions.setFilterRating, (state, { rating }) => ({
    ...state,
    filterRating: rating,
  })),
  on(ReviewsActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
  })),
);
