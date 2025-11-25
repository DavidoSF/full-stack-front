import { createReducer, on } from '@ngrx/store';
import { initialWishlistState } from './wishlist.state';
import { WishlistItem } from '../../models/wishlist-item.model';
import { WishlistActions } from './wishlist.actions';

export const wishlistReducer = createReducer(
  initialWishlistState,
  on(WishlistActions.addToWishlist, (state, { product }) => {
    const exists = state.items.some((item) => item.productId === product.id);
    if (exists) {
      return state;
    }

    const newItem: WishlistItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      addedAt: new Date().toISOString(),
    };

    return {
      ...state,
      items: [...state.items, newItem],
    };
  }),

  on(WishlistActions.removeFromWishlist, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.productId !== productId),
  })),

  on(WishlistActions.clearWishlist, () => initialWishlistState),

  on(WishlistActions.loadWishlist, (state) => ({ ...state, loading: true })),

  on(WishlistActions.loadWishlistSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
  })),

  on(WishlistActions.loadWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
