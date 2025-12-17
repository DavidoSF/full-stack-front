import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as AdminActions from './admin.actions';
import { AdminService } from '../../components/dashboard/services/admin.service';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private adminService = inject(AdminService);

  loadAdminStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminStats),
      switchMap(() =>
        this.adminService.getAdminStats().pipe(
          map((stats) => AdminActions.loadAdminStatsSuccess({ stats })),
          catchError((error) => of(AdminActions.loadAdminStatsFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
