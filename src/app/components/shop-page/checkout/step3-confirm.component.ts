import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, take } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Address } from '../models/address.model';
import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';
import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartCouponCode,
  selectPromoCode,
  selectPromoDiscount,
  selectShipping,
  selectTaxes,
  selectAppliedPromos,
} from '../cart/state/cart.selectors';
import { CartActions } from '../cart/state/cart.actions';
import { OrderActions } from '../orders/state/order.actions';
import {
  selectOrderLoading,
  selectCurrentOrder,
  selectOrderError,
} from '../orders/state/order.selectors';
import { selectTaxRate } from '../../../store/config/config.selectors';

@Component({
  selector: 'app-step3-confirm',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './step3-confirm.component.html',
  styleUrls: ['./step3-confirm.component.scss'],
})
export class Step3ConfirmComponent implements OnInit, OnDestroy {
  cartItems$!: Observable<CartItem[]>;
  total$!: Observable<number>;
  subtotal$!: Observable<number>;
  discount$!: Observable<number>;
  couponCode$!: Observable<string | undefined>;
  promoCode$!: Observable<string | undefined>;
  promoDiscount$!: Observable<number>;
  shipping$!: Observable<number>;
  taxes$!: Observable<number>;
  appliedPromos$!: Observable<string[]>;
  taxRate$!: Observable<number>;
  loading$!: Observable<boolean>;
  address: Address | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
    this.subtotal$ = this.store.select(selectCartSubtotal);
    this.discount$ = this.store.select(selectCartDiscount);
    this.couponCode$ = this.store.select(selectCartCouponCode);
    this.promoCode$ = this.store.select(selectPromoCode);
    this.promoDiscount$ = this.store.select(selectPromoDiscount);
    this.shipping$ = this.store.select(selectShipping);
    this.taxes$ = this.store.select(selectTaxes);
    this.appliedPromos$ = this.store.select(selectAppliedPromos);
    this.taxRate$ = this.store.select(selectTaxRate);
    this.loading$ = this.store.select(selectOrderLoading);

    const addressData = localStorage.getItem('checkout_address');
    if (addressData) {
      this.address = JSON.parse(addressData);
    } else {
      this.router.navigate(['/shop/checkout/address']);
    }

    this.store
      .select(selectCurrentOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe((order) => {
        if (order) {
          this.snackBar.open('Order placed successfully!', 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.store.dispatch(CartActions.clearCart());
          localStorage.removeItem('checkout_address');
          this.store.dispatch(OrderActions.clearCurrentOrder());
          this.router.navigate(['/shop/orders']);
        }
      });

    this.store
      .select(selectOrderError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.snackBar.open(`Order failed: ${error}`, 'Close', {
            duration: 8000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editAddress(): void {
    this.router.navigate(['/shop/checkout/address']);
  }

  goBack(): void {
    this.router.navigate(['/shop/checkout/address']);
  }

  placeOrder(): void {
    if (!this.address) return;

    let items: CartItem[] = [];
    let subtotal = 0;
    let total = 0;
    let discount = 0;
    let couponCode: string | undefined;
    let promoCode: string | undefined;
    let promoDiscount = 0;
    let shipping = 0;
    let taxes = 0;
    let appliedPromos: string[] = [];

    this.cartItems$.pipe(take(1)).subscribe((i) => (items = i));
    this.subtotal$.pipe(take(1)).subscribe((s) => (subtotal = s));
    this.total$.pipe(take(1)).subscribe((t) => (total = t));
    this.discount$.pipe(take(1)).subscribe((d) => (discount = d));
    this.couponCode$.pipe(take(1)).subscribe((c) => (couponCode = c));
    this.promoCode$.pipe(take(1)).subscribe((p) => (promoCode = p));
    this.promoDiscount$.pipe(take(1)).subscribe((p) => (promoDiscount = p));
    this.shipping$.pipe(take(1)).subscribe((s) => (shipping = s));
    this.taxes$.pipe(take(1)).subscribe((t) => (taxes = t));
    this.appliedPromos$.pipe(take(1)).subscribe((a) => (appliedPromos = a));

    const order: Order = {
      items,
      shippingAddress: this.address,
      subtotal,
      tax: taxes,
      shipping: shipping,
      total: total,
      couponCode,
      discount,
      promoCode,
      promoDiscount,
      appliedPromos,
    };

    this.store.dispatch(OrderActions.createOrder({ order }));
  }
}
