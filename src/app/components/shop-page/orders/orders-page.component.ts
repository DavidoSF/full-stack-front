import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../models/order.model';
import { selectAllOrders, selectOrderLoading } from './state/order.selectors';
import { OrderActions } from './state/order.actions';
import { OrderDetailsModalComponent } from './order-details-modal.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
  orders$!: Observable<Order[]>;
  loading$!: Observable<boolean>;

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.orders$ = this.store.select(selectAllOrders);
    this.loading$ = this.store.select(selectOrderLoading);
    this.store.dispatch(OrderActions.loadOrders());
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'delivered':
        return 'primary';
      case 'processing':
      case 'shipped':
        return 'accent';
      case 'cancelled':
        return 'warn';
      default:
        return 'warn';
    }
  }

  viewOrderDetails(orderId: string) {
    this.http.get<Order>(`${environment.apiUrl}/orders/${orderId}/`).subscribe({
      next: (order) => {
        this.dialog.open(OrderDetailsModalComponent, {
          width: '700px',
          maxWidth: '90vw',
          data: order,
        });
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        alert('Failed to load order details. Please try again.');
      },
    });
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.store.dispatch(OrderActions.cancelOrder({ orderId }));
    }
  }

  continueShopping() {
    this.router.navigate(['/shop/products']);
  }
}
