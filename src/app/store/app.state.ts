import { AuthState } from '../components/login-page/state/auth.state';
import { ProductState } from '../components/shop-page/state/product.state';
import { CartState } from '../components/shop-page/cart/state/cart.state';
import { WishlistState } from '../components/shop-page/wishlist/state/wishlist.state';
import { OrderState } from '../components/shop-page/orders/state/order.state';
import { AddressState } from '../components/shop-page/address/state/address.state';
import { ReviewsState } from '../components/shop-page/reviews/state/reviews.state';

export interface AppState {
  product: ProductState;
  auth: AuthState;
  cart: CartState;
  wishlist: WishlistState;
  order: OrderState;
  address: AddressState;
  reviews: ReviewsState;
}
