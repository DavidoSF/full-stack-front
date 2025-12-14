import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReviewsActions } from './state/reviews.actions';
import {
  selectFilteredAndSortedReviews,
  selectReviewsLoading,
  selectAverageRating,
  selectRatingDistribution,
  selectFilterRating,
  selectSortBy,
} from './state/reviews.selectors';
import { selectUser } from '../../login-page/state/auth.selectors';
import { ProductReview } from '../models/product-review.model';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss'],
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId!: number;

  private store = inject(Store);
  private fb = inject(FormBuilder);

  reviews$!: Observable<ProductReview[]>;
  loading$!: Observable<boolean>;
  averageRating$!: Observable<number>;
  ratingDistribution$!: Observable<{ [key: number]: number }>;
  filterRating$!: Observable<number | null>;
  sortBy$!: Observable<'recent' | 'highest' | 'lowest'>;
  user$!: Observable<any>;

  reviewForm: FormGroup;
  showReviewForm = false;

  stars = [1, 2, 3, 4, 5];

  constructor() {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.reviews$ = this.store.select(selectFilteredAndSortedReviews);
    this.loading$ = this.store.select(selectReviewsLoading);
    this.averageRating$ = this.store.select(selectAverageRating);
    this.ratingDistribution$ = this.store.select(selectRatingDistribution);
    this.filterRating$ = this.store.select(selectFilterRating);
    this.sortBy$ = this.store.select(selectSortBy);
    this.user$ = this.store.select(selectUser);

    if (this.productId) {
      this.store.dispatch(ReviewsActions.loadReviews({ productId: this.productId }));
    }
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.productId) {
      const { rating, comment } = this.reviewForm.value;
      this.store.dispatch(
        ReviewsActions.submitReview({ productId: this.productId, rating, comment }),
      );
      this.reviewForm.reset({ rating: 5, comment: '' });
      this.showReviewForm = false;
    }
  }

  setFilterRating(rating: number | null): void {
    this.store.dispatch(ReviewsActions.setFilterRating({ rating }));
  }

  setSortBy(sortBy: 'recent' | 'highest' | 'lowest'): void {
    this.store.dispatch(ReviewsActions.setSortBy({ sortBy }));
  }

  getStarArray(rating: number): boolean[] {
    return this.stars.map((star) => star <= rating);
  }

  getRatingPercentage(star: number, distribution: { [key: number]: number }): number {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;
    return (distribution[star] / total) * 100;
  }
}
