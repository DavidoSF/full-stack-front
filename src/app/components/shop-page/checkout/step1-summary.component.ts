import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectCartCouponCode,
} from '../cart/state/cart.selectors';

@Component({
  selector: 'app-step1-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step1-summary.component.html',
  styleUrls: ['./step1-summary.component.scss'],
})
export class Step1SummaryComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  subtotal$!: Observable<number>;
  total$!: Observable<number>;
  discount$!: Observable<number>;
  couponCode$!: Observable<string | undefined>;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectCartItems);
    this.subtotal$ = this.store.select(selectCartSubtotal);
    this.total$ = this.store.select(selectCartTotal);
    this.discount$ = this.store.select(selectCartDiscount);
    this.couponCode$ = this.store.select(selectCartCouponCode);
  }

  goBack(): void {
    this.router.navigate(['/shop/cart']);
  }

  nextStep(): void {
    this.router.navigate(['/shop/checkout/address']);
  }
}
