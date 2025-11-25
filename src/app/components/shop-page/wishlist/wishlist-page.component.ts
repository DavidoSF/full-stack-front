import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item.model';
import { selectWishlistItems } from './state/wishlist.selectors';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartActions } from '../cart/state/cart.actions';
import { WishlistActions } from './state/wishlist.actions';

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
    this.store.dispatch(
      CartActions.addItem({
        product: {
          id: item.productId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
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
}
