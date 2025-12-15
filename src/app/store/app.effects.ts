import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { CartEffects } from '../components/shop-page/cart/state/cart.effects';
import { WishlistEffects } from '../components/shop-page/wishlist/state/wishlist.effects';
import { ConfigEffects } from './config/config.effects';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}
}

export const appEffects = [AppEffects, CartEffects, WishlistEffects, ConfigEffects];
