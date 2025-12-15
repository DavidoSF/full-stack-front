import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil, map } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProductActions as _ProductActions, ProductActions } from '../state/product.actions';
import { AppState } from '../../../store/app.state';
import {
  selectProductRatingError,
  selectProductRatingLoading,
  selectProductRatingSummary,
} from '../state/product.selectors';
import { MatCardModule } from '@angular/material/card';
import { ProductModel } from '../models/product.model';
import { ReviewsActions } from '../reviews/state/reviews.actions';
import {
  selectFilteredAndSortedReviews,
  selectReviewsLoading,
  selectAverageRating,
  selectFilterRating,
  selectSortBy,
} from '../reviews/state/reviews.selectors';
import { ProductReview } from '../models/product-review.model';
import { selectUser } from '../../login-page/state/auth.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-rating-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-rating-page.html',
  styleUrl: './product-rating-page.scss',
})
export class ProductRatingPage implements OnInit, OnDestroy {
  Math = Math;
  loading$?: Observable<boolean | undefined>;
  error$?: Observable<any>;
  summary$?: Observable<any>;
  ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  private destroy$ = new Subject<void>();

  product: ProductModel | undefined;
  productId!: number;

  reviews$!: Observable<ProductReview[]>;
  reviewsLoading$!: Observable<boolean>;
  filterRating$!: Observable<number | null>;
  sortBy$!: Observable<'recent' | 'highest' | 'lowest'>;
  user$!: Observable<any>;
  allReviews$!: Observable<ProductReview[]>;
  reviewsCount$!: Observable<number>;
  averageRating$!: Observable<number>;

  reviewForm!: FormGroup;
  showReviewForm = false;
  ratingOptions = [1, 2, 3, 4, 5];
  filterOptions = [null, 5, 4, 3, 2, 1];
  sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
  ];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectProductRatingLoading);
    this.error$ = this.store.select(selectProductRatingError);
    this.summary$ = this.store.select(selectProductRatingSummary);

    this.summary$.pipe(takeUntil(this.destroy$)).subscribe((summary) => {
      if (summary) {
        this.store
          .select((state) => state.product.products)
          .pipe(take(1))
          .subscribe((products) => {
            const product = products?.find((p) => p.id === summary.product_id);
            if (product) {
              this.product = product;
            }
          });
      }
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productId = id;
      this.store.dispatch(ProductActions.loadProductRating({ id }));
      this.store.dispatch(ReviewsActions.loadReviews({ productId: id }));
    }

    this.reviews$ = this.store.select(selectFilteredAndSortedReviews);
    this.reviewsLoading$ = this.store.select(selectReviewsLoading);
    this.filterRating$ = this.store.select(selectFilterRating);
    this.sortBy$ = this.store.select(selectSortBy);
    this.user$ = this.store.select(selectUser);

    this.allReviews$ = this.store.select((state) => state.reviews.reviews);
    this.reviewsCount$ = this.allReviews$.pipe(map((reviews) => reviews.length));
    this.averageRating$ = this.store.select(selectAverageRating);

    this.allReviews$.pipe(takeUntil(this.destroy$)).subscribe((reviews) => {
      if (reviews && reviews.length > 0) {
        this.calculateRatingDistributionFromReviews(reviews);
      } else {
        this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
    });

    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  calculateRatingDistribution(ratings: any[]) {
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratings.forEach((rating) => {
      const value = Math.round(rating.value);
      if (value >= 1 && value <= 5) {
        this.ratingDistribution[value] = (this.ratingDistribution[value] || 0) + 1;
      }
    });
  }

  calculateRatingDistributionFromReviews(reviews: ProductReview[]) {
    this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      const value = Math.round(review.rating);
      if (value >= 1 && value <= 5) {
        this.ratingDistribution[value] = (this.ratingDistribution[value] || 0) + 1;
      }
    });
  }

  getRatingCount(star: number): number {
    return this.ratingDistribution[star] || 0;
  }

  getRatingPercentage(star: number): number {
    const count = this.getRatingCount(star);
    const total = Object.values(this.ratingDistribution).reduce((sum, val) => sum + val, 0);
    if (total === 0) return 0;
    return (count / total) * 100;
  }

  back() {
    this.router.navigateByUrl('/shop/products');
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    if (!this.showReviewForm) {
      this.reviewForm.reset({ rating: 5, comment: '' });
    }
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const { rating, comment } = this.reviewForm.value;
      this.store.dispatch(
        ReviewsActions.submitReview({
          productId: this.productId,
          rating,
          comment,
        }),
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

  getFilterLabel(rating: number | null): string {
    return rating === null ? 'All' : `${rating}★`;
  }

  getStarArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i + 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
