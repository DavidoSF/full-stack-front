import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../../models/wishlist-item.model';

export class WishlistActions {
  static addToWishlist = createAction(
    '[Wishlist] Add Item',
    props<{
      product: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
        stock?: number;
        lowStockThreshold?: number;
      };
    }>(),
  );

  static removeFromWishlist = createAction(
    '[Wishlist] Remove Item',
    props<{ productId: number }>(),
  );

  static clearWishlist = createAction('[Wishlist] Clear');

  static loadWishlist = createAction('[Wishlist] Load');

  static loadWishlistSuccess = createAction(
    '[Wishlist] Load Success',
    props<{ items: WishlistItem[] }>(),
  );

  static loadWishlistFailure = createAction('[Wishlist] Load Failure', props<{ error: string }>());
}
