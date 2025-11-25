import { WishlistItem } from '../../models/wishlist-item.model';

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export const initialWishlistState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};
