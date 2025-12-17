import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectAuthUser, selectIsAuthenticated } from '../login-page/state/auth.selectors';
import { AuthActions } from '../login-page/state/auth.actions';
import { CartIconComponent } from '../shop-page/cart/cart-icon.component';
import { selectWishlistCount } from '../shop-page/wishlist/state/wishlist.selectors';
import { selectAllProducts } from '../shop-page/state/product.selectors';
import { ProductModel } from '../shop-page/models/product.model';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    CartIconComponent,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isLoggedIn = signal(false);
  userName = signal('Guest');
  wishlistCount$!: Observable<number>;

  @ViewChild('searchContainer', { read: ElementRef }) searchContainer?: ElementRef;
  searchQuery = signal('');
  showSearchDropdown = signal(false);
  allProducts = signal<ProductModel[]>([]);

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    return this.allProducts()
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      )
      .slice(0, 8);
  });

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    effect(() => {
      this.store.select(selectAllProducts).subscribe((products) => {
        if (products) {
          this.allProducts.set(products);
        }
      });
    });
  }

  ngOnInit() {
    this.wishlistCount$ = this.store.select(selectWishlistCount);

    this.store.select(selectIsAuthenticated).subscribe((isAuth) => {
      this.isLoggedIn.set(isAuth);
      if (isAuth) {
        this.store.select(selectAuthUser).subscribe((user) => {
          if (user) this.userName.set(user.username);
        });
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.showSearchDropdown.set(input.value.trim().length > 0);
  }

  onSearchFocus() {
    if (this.searchQuery().trim().length > 0) {
      this.showSearchDropdown.set(true);
    }
  }

  selectProduct(productId: number) {
    this.showSearchDropdown.set(false);
    this.searchQuery.set('');
    this.router.navigateByUrl(`/shop/products/${productId}`);
    console.log('Navigating to product:', productId);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.showSearchDropdown.set(false);
    }
  }

  onLogout() {
    console.log('Logout');
    this.isLoggedIn.set(false);

    this.store.dispatch(AuthActions.logout());
  }
}
