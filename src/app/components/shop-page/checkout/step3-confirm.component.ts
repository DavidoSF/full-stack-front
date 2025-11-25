import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
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
} from '../cart/state/cart.selectors';
import { selectCurrentOrder, selectOrderLoading } from '../orders/state/order.selectors';
import { OrderActions } from '../orders/state/order.actions';
import { CartActions } from '../cart/state/cart.actions';

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

    this.cartItems$.pipe(takeUntil(this.destroy$)).subscribe((i) => (items = i));
    this.subtotal$.pipe(takeUntil(this.destroy$)).subscribe((s) => (subtotal = s));
    this.total$.pipe(takeUntil(this.destroy$)).subscribe((t) => (total = t));
    this.discount$.pipe(takeUntil(this.destroy$)).subscribe((d) => (discount = d));
    this.couponCode$.pipe(takeUntil(this.destroy$)).subscribe((c) => (couponCode = c));

    const shipping = 5.99;
    const tax = total * 0.1;
    const finalTotal = total + shipping + tax;

    const order: Order = {
      items,
      shippingAddress: this.address,
      subtotal,
      tax,
      shipping,
      total: finalTotal,
      couponCode,
      discount,
    };

    this.store.dispatch(OrderActions.createOrder({ order }));
  }
}
