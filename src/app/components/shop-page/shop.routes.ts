import { Routes } from '@angular/router';
import { ProductsPage } from './products-page/products-page';
import { ProductRatingPage } from './product-rating-page/product-rating-page';
import { ShopPage } from './shop-page';

export const routes: Routes = [
  {
    path: '',
    component: ShopPage,
    children: [
      { path: 'products', component: ProductsPage },
      { path: 'rating', component: ProductRatingPage },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'shop',
      },
      { path: '**', redirectTo: 'products' },
    ],
  },
];
