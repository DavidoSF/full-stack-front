import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  constructor(private store: Store<AppState>) {}

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
    console.log('Search:', input.value);
  }

  onLogout() {
    console.log('Logout');
    this.isLoggedIn.set(false);

    this.store.dispatch(AuthActions.logout());
  }
}
