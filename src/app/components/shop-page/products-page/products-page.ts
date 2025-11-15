import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { ProductModel } from '../models/product.model';
import { selectAllProducts, selectProductsCount } from '../state/product.selectors';
import { AppState } from '../../../store/app.state';
import { ProductActions } from '../state/product.actions';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage implements OnInit {
  products$: Observable<ProductModel[] | undefined> | undefined;
  count$: Observable<number | undefined> | undefined;

  page = 1;
  page_size = 10;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.products$ = this.store.select(selectAllProducts);
    this.count$ = this.store.select(selectProductsCount);
    this.loadPage();
  }

  loadPage() {
    this.store.dispatch(
      ProductActions.loadProducts({ params: { page: this.page, page_size: this.page_size } }),
    );
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPage();
    }
  }

  nextPage(total?: number) {
    const totalPages = this.totalPages(total);
    if (!totalPages || this.page < (totalPages || Infinity)) {
      this.page++;
      this.loadPage();
    }
  }

  setPageSize(size: number) {
    this.page_size = size;
    this.page = 1;
    this.loadPage();
  }

  totalPages(total?: number): number | undefined {
    return total && this.page_size ? Math.ceil(total / this.page_size) : undefined;
  }
}
