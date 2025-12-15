import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigActions } from './config.actions';
import { StoreConfig } from '../../shared/models/config.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ConfigEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadConfig),
      switchMap(() =>
        this.http.get<StoreConfig>(`${environment.apiUrl}/config/`).pipe(
          map((config) => ConfigActions.loadConfigSuccess({ config })),
          catchError((error) => of(ConfigActions.loadConfigFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  constructor() {}
}
