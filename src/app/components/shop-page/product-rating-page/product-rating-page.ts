import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProductActions as _ProductActions, ProductActions } from '../state/product.actions';
import { AppState } from '../../../store/app.state';
import {
  selectProductRatingError,
  selectProductRatingLoading,
  selectProductRatingSummary,
} from '../state/product.selectors';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-rating-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './product-rating-page.html',
  styleUrl: './product-rating-page.scss',
})
export class ProductRatingPage implements OnInit {
  loading$?: Observable<boolean | undefined>;
  error$?: Observable<any>;
  summary$?: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectProductRatingLoading);
    this.error$ = this.store.select(selectProductRatingError);
    this.summary$ = this.store.select(selectProductRatingSummary);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.dispatch(ProductActions.loadProductRating({ id }));
    }
  }

  back() {
    this.router.navigateByUrl('/shop/products');
  }
}
