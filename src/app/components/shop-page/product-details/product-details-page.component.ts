import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, combineLatest, BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailsService } from './services/product-details.service';
import { ProductDetails } from './models/product-details.model';
import { selectIsInWishlist } from '../wishlist/state/wishlist.selectors';
import { CartActions } from '../cart/state/cart.actions';
import { WishlistActions } from '../wishlist/state/wishlist.actions';
import { selectCartItems } from '../cart/state/cart.selectors';
import { ProductDetailsSkeleton } from './product-details-skeleton/product-details-skeleton';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ProductDetailsSkeleton],
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss'],
})
export class ProductDetailsPageComponent implements OnInit {
  product: ProductDetails | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;
  isInWishlist$!: Observable<boolean>;
  canAddToCart$!: Observable<boolean>;
  private quantitySubject = new BehaviorSubject<number>(1);
  private productId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailsService: ProductDetailsService,
    private store: Store,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.productId = id;
        this.loadProductDetails(id);
        this.isInWishlist$ = this.store.select(selectIsInWishlist(id));
        this.initializeCanAddToCart(id);
      }
    }, 2000);
  }

  initializeCanAddToCart(productId: number): void {
    this.canAddToCart$ = combineLatest([
      this.store.select(selectCartItems),
      this.quantitySubject.asObservable(),
    ]).pipe(
      map(([cartItems, currentQuantity]) => {
        if (!this.product || this.product.stock === 0) {
          return false;
        }
        const cartItem = cartItems.find((item) => item.productId === productId);
        const quantityInCart = cartItem?.quantity || 0;
        return quantityInCart + currentQuantity <= this.product.stock;
      }),
    );
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    this.error = null;
    this.productDetailsService.getProductDetails(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  retry(): void {
    this.loadProductDetails(this.productId);
  }

  increaseQuantity(): void {
    if (this.product && this.product.stock > 0 && this.quantity < this.product.stock) {
      this.quantity++;
      this.quantitySubject.next(this.quantity);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantitySubject.next(this.quantity);
    }
  }

  addToCart(): void {
    if (this.product) {
      if (this.product.stock === 0) {
        this.notificationService.warning('This product is out of stock');
        return;
      }

      if (this.quantity > this.product.stock) {
        this.notificationService.warning(`Only ${this.product.stock} items available`);
        return;
      }

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

      const snackBarRef = this.notificationService.success(
        `${this.product.name} added to cart!`,
        'View Cart',
      );
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/shop/cart']);
      });

      this.quantity = 1;
      this.quantitySubject.next(1);
    }
  }

  getStockStatus(): { message: string; cssClass: string } {
    if (!this.product) {
      return { message: '', cssClass: '' };
    }

    const { stock, lowStockThreshold } = this.product;

    if (stock === 0) {
      return { message: 'Out of stock', cssClass: 'out-of-stock' };
    } else if (stock > 0 && stock <= lowStockThreshold) {
      return { message: `Only ${stock} left`, cssClass: 'low-stock' };
    } else {
      return { message: 'In stock', cssClass: 'in-stock' };
    }
  }

  goBack(): void {
    this.router.navigate(['/shop/products']);
  }

  toggleWishlist(isInWishlist: boolean): void {
    if (this.product) {
      if (isInWishlist) {
        this.store.dispatch(WishlistActions.removeFromWishlist({ productId: this.product.id }));
        this.notificationService.info('Removed from wishlist');
      } else {
        this.store.dispatch(
          WishlistActions.addToWishlist({
            product: {
              id: this.product.id,
              name: this.product.name,
              price: this.product.price,
              stock: this.product.stock,
              lowStockThreshold: this.product.lowStockThreshold,
            },
          }),
        );
        const snackBarRef = this.notificationService.success('Added to wishlist!', 'View Wishlist');
        snackBarRef.onAction().subscribe(() => {
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
