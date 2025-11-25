import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectWishlistItems } from './wishlist.selectors';
import { WishlistItem } from '../../models/wishlist-item.model';
import { WishlistActions } from './wishlist.actions';

@Injectable()
export class WishlistEffects {
  private readonly WISHLIST_STORAGE_KEY = 'shopping_wishlist';
  private actions$ = inject(Actions);
  private store = inject(Store);

  saveWishlist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WishlistActions.addToWishlist,
          WishlistActions.removeFromWishlist,
          WishlistActions.clearWishlist,
        ),
        withLatestFrom(this.store.select(selectWishlistItems)),
        tap(([, items]) => {
          try {
            localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(items));
          } catch (error) {
            console.error('Failed to save wishlist to localStorage', error);
          }
        }),
      ),
    { dispatch: false },
  );

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      map(() => {
        try {
          const wishlistData = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
          if (wishlistData) {
            const items: WishlistItem[] = JSON.parse(wishlistData);
            return WishlistActions.loadWishlistSuccess({ items });
          }
          return WishlistActions.loadWishlistSuccess({ items: [] });
        } catch (error) {
          return WishlistActions.loadWishlistFailure({
            error: 'Failed to load wishlist from storage',
          });
        }
      }),
      catchError((error) => of(WishlistActions.loadWishlistFailure({ error: error.message }))),
    ),
  );

  constructor() {}
}
