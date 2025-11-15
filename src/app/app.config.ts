import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './components/login-page/state/auth.effects';
import { ProductEffects } from './components/shop-page/state/product.effects';
import { AppEffects } from './store/app.effects';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpTokenInterceptor } from './interceptors/http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom([HttpTokenInterceptor]),
    provideHttpClient(),
    importProvidersFrom([ReactiveFormsModule]),
    provideBrowserGlobalErrorListeners(),
    provideStore(appReducer),
    provideEffects([AppEffects, AuthEffects, ProductEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
