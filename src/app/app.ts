import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './components/login-page/state/auth.actions';
import { WishlistActions } from './components/shop-page/wishlist/state/wishlist.actions';
import { CartActions } from './components/shop-page/cart/state/cart.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('my-shop');

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(CartActions.loadCart());
    this.store.dispatch(WishlistActions.loadWishlist());
    this.store.dispatch(AuthActions.loadAuthFromStorage());
  }
}
