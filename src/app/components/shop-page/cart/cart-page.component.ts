import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItemComponent } from './cart-item.component';
import { CartItem } from '../models/cart-item.model';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
  selectCartCouponCode,
} from './state/cart.selectors';
import { CartActions } from './state/cart.actions';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CartItemComponent],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss', './animations.css'],
})
export class CartPageComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  subtotal$!: Observable<number>;
  total$!: Observable<number>;
  discount$!: Observable<number>;
  couponCode$!: Observable<string | undefined>;

  couponInput = '';
  couponError = '';

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

  onQuantityChange(event: { productId: number; quantity: number }): void {
    this.store.dispatch(CartActions.updateQuantity(event));
  }

  onRemoveItem(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  applyCoupon(): void {
    if (this.couponInput.trim()) {
      this.store.dispatch(CartActions.applyCoupon({ couponCode: this.couponInput.trim() }));
      this.couponError = '';
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.store.dispatch(CartActions.clearCart());
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/shop/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/shop/products']);
  }
}
