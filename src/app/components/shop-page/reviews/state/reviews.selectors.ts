import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.state';

export const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');

export const selectAllReviews = createSelector(selectReviewsState, (state) => state.reviews);

export const selectReviewsLoading = createSelector(selectReviewsState, (state) => state.loading);

export const selectReviewsError = createSelector(selectReviewsState, (state) => state.error);

export const selectFilterRating = createSelector(selectReviewsState, (state) => state.filterRating);

export const selectSortBy = createSelector(selectReviewsState, (state) => state.sortBy);

export const selectFilteredAndSortedReviews = createSelector(
  selectAllReviews,
  selectFilterRating,
  selectSortBy,
  (reviews, filterRating, sortBy) => {
    let filtered = reviews;

    if (filterRating !== null) {
      filtered = reviews.filter((review) => review.rating === filterRating);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }

    return sorted;
  },
);

export const selectAverageRating = createSelector(selectAllReviews, (reviews) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
});

export const selectRatingDistribution = createSelector(selectAllReviews, (reviews) => {
  const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });
  return distribution;
});
