import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './components/login-page/state/auth.effects';
import { ProductEffects } from './components/shop-page/state/product.effects';
import { CartEffects } from './components/shop-page/cart/state/cart.effects';
import { WishlistEffects } from './components/shop-page/wishlist/state/wishlist.effects';
import { OrderEffects } from './components/shop-page/orders/state/order.effects';
import { AddressEffects } from './components/shop-page/address/state/address.effects';
import { AppEffects } from './store/app.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { httpTokenInterceptor } from './interceptors/http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom([ReactiveFormsModule]),
    provideHttpClient(withInterceptors([httpTokenInterceptor])),
    provideHttpClient(),
    importProvidersFrom([ReactiveFormsModule]),
    provideBrowserGlobalErrorListeners(),
    provideStore(appReducer),
    provideEffects([
      AppEffects,
      AuthEffects,
      ProductEffects,
      CartEffects,
      WishlistEffects,
      OrderEffects,
      AddressEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
  ],
};
