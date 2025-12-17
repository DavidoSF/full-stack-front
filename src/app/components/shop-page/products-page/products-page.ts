import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

import { ProductModel } from '../models/product.model';
import {
  selectAllProducts,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
} from '../state/product.selectors';
import { AppState } from '../../../store/app.state';
import { ProductActions } from '../state/product.actions';
import { ProductItem } from './product-item/product-item';
import { ProductSkeleton } from './product-skeleton/product-skeleton';
import { products } from '../../../../mocks/data';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    ProductItem,
    ProductSkeleton,
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit, OnChanges, OnDestroy {
  products$: Observable<ProductModel[] | undefined> | undefined;
  realProducts$: Observable<ProductModel[] | undefined> | undefined;
  count$: Observable<number | undefined> | undefined;
  loading$: Observable<boolean | undefined> | undefined;
  error$: Observable<any> | undefined;
  isLoadingSkeleton = true;

  @Input()
  page = 1;

  @Input()
  page_size = 10;

  @Input()
  listProducts: ProductModel[] | undefined;

  minRating: number | undefined = undefined;
  ordering: string | undefined = undefined;
  private minRatingSubject = new Subject<number | undefined>();
  private orderingSubject = new Subject<string | undefined>();
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setupDebounce();
    this.loadFromURL();

    this.updateProductsList();
    window.addEventListener('popstate', this.handlePopState);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('popstate', this.handlePopState);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['page'] || changes['page_size'] || changes['listProducts']) {
      this.updateProductsList();
    }
  }

  private setupDebounce(): void {
    this.minRatingSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.minRating = value;
        this.page = 1;
        this.updateURL();
        this.loadPage();
      });

    // Debounce ordering changes
    this.orderingSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.ordering = value;
        this.page = 1;
        this.updateURL();
        this.loadPage();
      });
  }

  private loadFromURL(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.page = params['page'] ? parseInt(params['page'], 10) : 1;
      this.page_size = params['page_size'] ? parseInt(params['page_size'], 10) : 10;
      this.minRating = params['min_rating'] ? parseFloat(params['min_rating']) : undefined;
      this.ordering = params['ordering'] || undefined;
    });
  }

  private handlePopState = (): void => {
    this.loadFromURL();
    this.loadPage();
  };

  private updateURL(): void {
    const queryParams: any = {
      page: this.page,
      page_size: this.page_size,
    };

    if (this.minRating !== undefined && this.minRating > 0) {
      queryParams.min_rating = this.minRating;
    }

    if (this.ordering) {
      queryParams.ordering = this.ordering;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  updateProductsList() {
    if (this.listProducts) {
      const startIndex = (this.page - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      const paginatedProducts = this.listProducts.slice(startIndex, endIndex);

      this.products$ = new Observable((observer) => {
        observer.next(paginatedProducts);
        observer.complete();
      });

      this.count$ = new Observable((observer) => {
        observer.next(this.listProducts!.length);
        observer.complete();
      });
    } else {
      this.count$ = this.store.select(selectProductsCount);
      this.loading$ = this.store.select(selectProductsLoading);
      this.error$ = this.store.select(selectProductsError);

      setTimeout(() => {
        this.loadPage();
      }, 2000);

      this.store
        .select((state) => state.product.products)
        .pipe(
          takeUntil(this.destroy$),
          tap((products) => {
            console.log(products);
            if (products && products.length > 0) {
              this.isLoadingSkeleton = false;
              this.realProducts$ = this.store.select(selectAllProducts);
            } else if (products && products.length === 0) {
              this.isLoadingSkeleton = false;
            } else {
              this.isLoadingSkeleton = true;
            }
            this.cdr.detectChanges();
          }),
        )
        .subscribe();
    }
  }

  loadPage() {
    if (!this.listProducts) {
      const params: any = {
        page: this.page,
        page_size: this.page_size,
      };

      if (this.minRating !== undefined && this.minRating > 0) {
        params.min_rating = this.minRating;
      }

      if (this.ordering) {
        params.ordering = this.ordering;
      }

      this.store.dispatch(ProductActions.loadProducts({ params }));
    }
  }

  onMinRatingChange(value: number | undefined): void {
    this.minRatingSubject.next(value);
  }

  onOrderingChange(value: string | undefined): void {
    this.orderingSubject.next(value);
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updateURL();
      this.loadPage();
    }
  }

  nextPage(total?: number) {
    const totalPages = this.totalPages(total);
    if (!totalPages || this.page < (totalPages || Infinity)) {
      this.page++;
      this.updateURL();
      this.loadPage();
    }
  }

  setPageSize(size: number) {
    this.page_size = size;
    this.page = 1;
    this.updateURL();
    this.loadPage();
  }

  totalPages(total?: number): number | undefined {
    return total && this.page_size ? Math.ceil(total / this.page_size) : undefined;
  }

  retry(): void {
    this.loadPage();
  }
}
