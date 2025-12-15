import { ActionReducerMap, combineReducers } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from '../components/shop-page/state/product.reducer';
import { authReducer } from '../components/login-page/state/auth.reducer';
import { cartReducer } from '../components/shop-page/cart/state/cart.reducer';
import { wishlistReducer } from '../components/shop-page/wishlist/state/wishlist.reducer';
import { orderReducer } from '../components/shop-page/orders/state/order.reducer';
import { addressReducer } from '../components/shop-page/address/state/address.reducer';
import { reviewsReducer } from '../components/shop-page/reviews/state/reviews.reducer';
import { configReducer } from './config/config.reducer';
import { adminReducer } from './admin/admin.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  address: addressReducer,
  reviews: reviewsReducer,
  config: configReducer,
  admin: adminReducer,
};
