import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, combineLatest } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item.model';
import { selectWishlistItems } from './state/wishlist.selectors';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartActions } from '../cart/state/cart.actions';
import { WishlistActions } from './state/wishlist.actions';
import { selectCartItems } from '../cart/state/cart.selectors';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.scss'],
})
export class WishlistPageComponent implements OnInit {
  wishlistItems$!: Observable<WishlistItem[]>;

  constructor(
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.wishlistItems$ = this.store.select(selectWishlistItems);
  }

  addToCart(item: WishlistItem): void {
    if (item.stock !== undefined && item.stock === 0) {
      this.snackBar.open(`${item.name} is out of stock`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.store
      .select(selectCartItems)
      .pipe()
      .subscribe((cartItems) => {
        const cartItem = cartItems.find((ci) => ci.productId === item.productId);
        const quantityInCart = cartItem?.quantity || 0;

        if (item.stock !== undefined && quantityInCart >= item.stock) {
          this.snackBar.open(`Cannot add more - already at stock limit (${item.stock})`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          return;
        }

        this.store.dispatch(
          CartActions.addItem({
            product: {
              id: item.productId,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
              stock: item.stock,
            },
            quantity: 1,
          }),
        );

        this.snackBar
          .open(`${item.name} added to cart!`, 'View Cart', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })
          .onAction()
          .subscribe(() => {
            this.router.navigate(['/shop/cart']);
          });
      })
      .unsubscribe();
  }

  getStockStatus(item: WishlistItem): { message: string; cssClass: string } {
    if (!item.stock && item.stock !== 0) {
      return { message: '', cssClass: '' };
    }

    const { stock, lowStockThreshold } = item;

    if (stock === 0) {
      return { message: 'Out of stock', cssClass: 'out-of-stock' };
    } else if (lowStockThreshold && stock > 0 && stock <= lowStockThreshold) {
      return { message: `Only ${stock} left`, cssClass: 'low-stock' };
    } else {
      return { message: 'In stock', cssClass: 'in-stock' };
    }
  }

  removeFromWishlist(productId: number): void {
    this.store.dispatch(WishlistActions.removeFromWishlist({ productId }));
    this.snackBar.open('Item removed from wishlist', 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  continueShopping(): void {
    this.router.navigate(['/shop/products']);
  }

  canAddToCart$(productId: number, stock?: number): Observable<boolean> {
    if (stock === undefined || stock === 0) {
      return new Observable((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.store.select(selectCartItems).pipe(
      map((cartItems) => {
        const cartItem = cartItems.find((item) => item.productId === productId);
        const quantityInCart = cartItem?.quantity || 0;
        return quantityInCart < stock;
      }),
    );
  }
}
