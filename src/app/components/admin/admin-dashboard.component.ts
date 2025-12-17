import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../../store/app.state';
import { AdminStats } from '../../store/admin/admin.state';
import * as AdminActions from '../../store/admin/admin.actions';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatTableModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private store = inject(Store<AppState>);

  stats$: Observable<AdminStats | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  displayedColumns: string[] = ['id', 'user', 'total', 'createdAt', 'status'];

  constructor() {
    this.stats$ = this.store.select((state) => state.admin.stats);
    this.loading$ = this.store.select((state) => state.admin.loading);
    this.error$ = this.store.select((state) => state.admin.error);
  }

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadAdminStats());
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      delivered: 'green',
      shipped: 'blue',
      processing: 'orange',
      pending: 'gray',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  }
}
