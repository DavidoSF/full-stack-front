import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard',
  },
];
