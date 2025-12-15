import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './components/app-placeholder.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginPage } from './components/login-page/login-page';
import { alreadyAuthenticatedGuard } from './guards/already-authenticated.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  {
    path: '',
    component: AppPlaceholderComponent,
    children: [
      { path: 'app', component: DashboardComponent },
      { path: 'login', component: LoginPage, canActivate: [alreadyAuthenticatedGuard] },
      {
        path: 'shop',
        canActivate: [authGuard],
        loadChildren: () => import('./components/shop-page/shop.routes').then((m) => m.routes),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./components/account/account.routes').then((m) => m.accountRoutes),
      },
      {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.routes').then((m) => m.adminRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
