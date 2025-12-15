import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../models/cart-item.model';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectCartCouponCode,
  selectPromoCode,
  selectPromoDiscount,
  selectShipping,
  selectTaxes,
  selectAppliedPromos,
  selectHasPromoApplied,
} from '../cart/state/cart.selectors';
import { selectTaxRate } from '../../../store/config/config.selectors';

@Component({
  selector: 'app-step1-summary',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './step1-summary.component.html',
  styleUrls: ['./step1-summary.component.scss'],
})
export class Step1SummaryComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  subtotal$!: Observable<number>;
  total$!: Observable<number>;
  discount$!: Observable<number>;
  couponCode$!: Observable<string | undefined>;

  promoCode$!: Observable<string | undefined>;
  promoDiscount$!: Observable<number>;
  shipping$!: Observable<number>;
  taxes$!: Observable<number>;
  appliedPromos$!: Observable<string[]>;
  hasPromoApplied$!: Observable<boolean>;
  taxRate$!: Observable<number>;

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

    this.promoCode$ = this.store.select(selectPromoCode);
    this.promoDiscount$ = this.store.select(selectPromoDiscount);
    this.shipping$ = this.store.select(selectShipping);
    this.taxes$ = this.store.select(selectTaxes);
    this.appliedPromos$ = this.store.select(selectAppliedPromos);
    this.hasPromoApplied$ = this.store.select(selectHasPromoApplied);
    this.taxRate$ = this.store.select(selectTaxRate);
  }

  goBack(): void {
    this.router.navigate(['/shop/cart']);
  }

  nextStep(): void {
    this.router.navigate(['/shop/checkout/address']);
  }
}
