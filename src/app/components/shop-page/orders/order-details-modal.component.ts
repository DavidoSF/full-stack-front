import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTaxRate } from '../../../store/config/config.selectors';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatStepperModule,
  ],
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.scss'],
})
export class OrderDetailsModalComponent implements OnInit {
  taxRate$!: Observable<number>;

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.taxRate$ = this.store.select(selectTaxRate);
  }

  getStatusSteps(): string[] {
    const statusMap: Record<string, string> = {
      confirmed: 'confirmed',
      processing: 'processing',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };

    const status = (this.order.status || '').toLowerCase();
    return ['confirmed', 'processing', 'shipped', 'delivered'];
  }

  isStepActive(step: string): boolean {
    const currentStatus = (this.order.status || '').toLowerCase();
    return currentStatus === step;
  }

  isStepCompleted(step: string): boolean {
    const currentStatus = (this.order.status || '').toLowerCase();
    const steps = ['confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex || (currentStatus === 'delivered' && step === 'delivered');
  }

  printOrder(): void {
    window.print();
  }
}
