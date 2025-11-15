import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductEffects {
  constructor(private actions$: Actions) {}
}
