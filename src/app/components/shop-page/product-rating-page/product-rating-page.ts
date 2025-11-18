import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';

import { ProductActions as _ProductActions, ProductActions } from '../state/product.actions';
import { AppState } from '../../../store/app.state';
import {
  selectProductRatingError,
  selectProductRatingLoading,
  selectProductRatingSummary,
} from '../state/product.selectors';
import { MatCardModule } from '@angular/material/card';
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-product-rating-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
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

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectProductRatingLoading);
    this.error$ = this.store.select(selectProductRatingError);
    this.summary$ = this.store.select(selectProductRatingSummary);

    this.summary$.pipe(takeUntil(this.destroy$)).subscribe((summary) => {
      if (summary) {
        this.store
          .select((state) => state.product.products)
          .pipe(takeUntil(this.destroy$))
          .subscribe((products) => {
            const product = products?.find((p) => p.id === summary.product_id);

            if (product) {
              this.product = product;
              const productRatings = product.ratings;
              this.calculateRatingDistribution(productRatings);
            }
          });
      }
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.dispatch(ProductActions.loadProductRating({ id }));
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
