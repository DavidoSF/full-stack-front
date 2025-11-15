import { AuthState } from '../components/login-page/state/auth.state';
import { ProductState } from '../components/shop-page/state/product.state';

export interface AppState {
  product: ProductState;
  auth: AuthState;
}
