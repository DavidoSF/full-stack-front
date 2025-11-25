import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../models/order.model';
import { selectAllOrders, selectOrderLoading } from './state/order.selectors';
import { OrderActions } from './state/order.actions';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent implements OnInit {
  orders$!: Observable<Order[]>;
  loading$!: Observable<boolean>;

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

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.store.dispatch(OrderActions.cancelOrder({ orderId }));
    }
  }

  continueShopping() {
    this.router.navigate(['/shop/products']);
  }
}
