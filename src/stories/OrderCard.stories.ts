import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Component, Input } from '@angular/core';
import { Order } from '../app/components/shop-page/models/order.model';

@Component({
  selector: 'app-order-card-wrapper',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="order-card">
      <mat-card-header>
        <mat-card-title>
          <div class="order-header">
            <span class="order-id">Order #{{ order.orderId }}</span>
            <mat-chip [color]="getStatusColor(order.status!)" selected>
              {{ order.status }}
            </mat-chip>
          </div>
        </mat-card-title>
        <mat-card-subtitle>
          <div class="order-meta">
            <span>Placed on {{ order.createdAt | date: 'medium' }}</span>
            <span *ngIf="order.estimatedDelivery">
              Est. Delivery: {{ order.estimatedDelivery | date: 'mediumDate' }}
            </span>
          </div>
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="order-details">
          <div class="order-items">
            <h3>Items ({{ order.items.length }})</h3>
            <div class="item" *ngFor="let item of order.items">
              <span class="item-name">{{ item.name }} × {{ item.quantity }}</span>
              <span class="item-price">{{ item.price * item.quantity | currency: 'EUR' }}</span>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>{{ order.subtotal | currency: 'EUR' }}</span>
            </div>
            <div class="summary-line" *ngIf="order.discount && order.discount > 0">
              <span>Discount ({{ order.couponCode }}):</span>
              <span class="discount">-{{ order.discount | currency: 'EUR' }}</span>
            </div>
            <div class="summary-line">
              <span>Shipping:</span>
              <span>{{ order.shipping | currency: 'EUR' }}</span>
            </div>
            <div class="summary-line">
              <span>Tax:</span>
              <span>{{ order.tax | currency: 'EUR' }}</span>
            </div>
            <div class="summary-line total">
              <span>Total:</span>
              <span>{{ order.total | currency: 'EUR' }}</span>
            </div>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions *ngIf="order.status !== 'Cancelled' && order.status !== 'Delivered'">
        <button mat-button color="warn">
          <mat-icon>cancel</mat-icon>
          Cancel Order
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .order-card {
        max-width: 800px;
        margin: 16px auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .order-id {
        font-weight: 600;
        font-size: 18px;
      }

      .order-meta {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        margin-top: 8px;
      }

      .order-meta span {
        color: #666;
        font-size: 14px;
      }

      .order-details {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        margin-top: 16px;
      }

      .order-items h3,
      .order-summary h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .item:last-child {
        border-bottom: none;
      }

      .item-name {
        color: #555;
      }

      .item-price {
        font-weight: 600;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 14px;
      }

      .summary-line.total {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 2px solid #e0e0e0;
        font-size: 18px;
        font-weight: 700;
        color: #1976d2;
      }

      .discount {
        color: #4caf50;
        font-weight: 600;
      }

      mat-card-actions {
        padding: 16px;
        border-top: 1px solid #e0e0e0;
      }
    `,
  ],
})
class OrderCardWrapper {
  @Input() order!: Order;

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'delivered':
        return 'primary';
      case 'processing':
      case 'shipped':
        return 'accent';
      default:
        return 'warn';
    }
  }
}

const meta: Meta<OrderCardWrapper> = {
  component: OrderCardWrapper,
  title: 'Shop/OrderCard',
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        RouterTestingModule,
        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<OrderCardWrapper>;

const baseOrder = {
  items: [
    { productId: 1, name: 'Wireless Mouse', price: 29.99, quantity: 1 },
    { productId: 2, name: 'USB-C Cable', price: 12.99, quantity: 2 },
  ],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    street: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'USA',
  },
  subtotal: 55.97,
  tax: 5.6,
  shipping: 5.99,
  total: 67.56,
};

export const Confirmed: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-001',
      confirmationNumber: 'CNF-ABC123',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const Processing: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-002',
      confirmationNumber: 'CNF-XYZ456',
      status: 'Processing',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const Shipped: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-003',
      confirmationNumber: 'CNF-DEF789',
      status: 'Shipped',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const Delivered: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-004',
      confirmationNumber: 'CNF-GHI012',
      status: 'Delivered',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const WithDiscount: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-005',
      confirmationNumber: 'CNF-JKL345',
      status: 'Confirmed',
      couponCode: 'SAVE20',
      discount: 11.19,
      subtotal: 55.97,
      tax: 4.48,
      shipping: 5.99,
      total: 56.25,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const Cancelled: Story = {
  args: {
    order: {
      ...baseOrder,
      orderId: 'ORD-2024-006',
      confirmationNumber: 'CNF-MNO678',
      status: 'Cancelled',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

export const LargeOrder: Story = {
  args: {
    order: {
      orderId: 'ORD-2024-007',
      confirmationNumber: 'CNF-PQR901',
      status: 'Processing',
      items: [
        { productId: 1, name: 'Laptop Stand', price: 49.99, quantity: 1 },
        { productId: 2, name: 'Keyboard', price: 79.99, quantity: 1 },
        { productId: 3, name: 'Monitor', price: 299.99, quantity: 1 },
        { productId: 4, name: 'Mouse Pad', price: 15.99, quantity: 2 },
        { productId: 5, name: 'HDMI Cable', price: 12.99, quantity: 1 },
      ],
      shippingAddress: baseOrder.shippingAddress,
      subtotal: 474.94,
      tax: 47.49,
      shipping: 0,
      total: 522.43,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};
