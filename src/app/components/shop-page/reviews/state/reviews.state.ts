import { ProductReview } from '../../models/product-review.model';

export interface ReviewsState {
  reviews: ProductReview[];
  loading: boolean;
  error: any;
  currentProductId: number | null;
  filterRating: number | null;
  sortBy: 'recent' | 'highest' | 'lowest';
}

export const initialReviewsState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  currentProductId: null,
  filterRating: null,
  sortBy: 'recent',
};
