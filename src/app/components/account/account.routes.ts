import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { ProfilePageComponent } from './profile-page.component';

export const accountRoutes: Routes = [
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    redirectTo: '/shop/orders',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];
