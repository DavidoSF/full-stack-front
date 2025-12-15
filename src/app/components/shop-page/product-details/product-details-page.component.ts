import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProductDetailsService } from './services/product-details.service';
import { ProductDetails } from './models/product-details.model';
import { selectIsInWishlist } from '../wishlist/state/wishlist.selectors';
import { CartActions } from '../cart/state/cart.actions';
import { WishlistActions } from '../wishlist/state/wishlist.actions';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss'],
})
export class ProductDetailsPageComponent implements OnInit {
  product: ProductDetails | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;
  isInWishlist$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailsService: ProductDetailsService,
    private store: Store,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProductDetails(id);
      this.isInWishlist$ = this.store.select(selectIsInWishlist(id));
    }
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    this.productDetailsService.getProductDetails(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  increaseQuantity(): void {
    if (this.product && (this.product.stock === 0 || this.quantity < this.product.stock)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.store.dispatch(
        CartActions.addItem({
          product: {
            id: this.product.id,
            name: this.product.name,
            price: this.product.price,
            stock: this.product.stock,
          },
          quantity: this.quantity,
        }),
      );

      this.snackBar
        .open(`${this.product.name} added to cart!`, 'View Cart', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/shop/cart']);
        });

      this.quantity = 1;
    }
  }

  goBack(): void {
    this.router.navigate(['/shop/products']);
  }

  toggleWishlist(isInWishlist: boolean): void {
    if (this.product) {
      if (isInWishlist) {
        this.store.dispatch(WishlistActions.removeFromWishlist({ productId: this.product.id }));
        this.snackBar.open('Removed from wishlist', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      } else {
        this.store.dispatch(
          WishlistActions.addToWishlist({
            product: {
              id: this.product.id,
              name: this.product.name,
              price: this.product.price,
            },
          }),
        );
        this.snackBar
          .open('Added to wishlist!', 'View Wishlist', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })
          .onAction()
          .subscribe(() => {
            this.router.navigate(['/shop/wishlist']);
          });
      }
    }
  }

  viewRating(): void {
    if (this.product) {
      this.router.navigate(['/shop/products', this.product.id, 'rating']);
    }
  }
}
