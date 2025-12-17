import { createReducer, on } from '@ngrx/store';
import { AdminState, initialAdminState } from './admin.state';
import * as AdminActions from './admin.actions';

export const adminReducer = createReducer(
  initialAdminState,
  on(
    AdminActions.loadAdminStats,
    (state): AdminState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    AdminActions.loadAdminStatsSuccess,
    (state, { stats }): AdminState => ({
      ...state,
      stats,
      loading: false,
      error: null,
    }),
  ),
  on(
    AdminActions.loadAdminStatsFailure,
    (state, { error }): AdminState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
