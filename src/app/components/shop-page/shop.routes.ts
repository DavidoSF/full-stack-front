import { Routes } from '@angular/router';
import { ProductsPage } from './products-page/products-page';
import { ProductRatingPage } from './product-rating-page/product-rating-page';

export const routes: Routes = [
  { path: 'products', component: ProductsPage },
  { path: 'rating', component: ProductRatingPage },
  { path: '**', redirectTo: 'products' },
];
