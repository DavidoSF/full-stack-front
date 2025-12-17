import { createReducer, on } from '@ngrx/store';
import { initialConfigState } from './config.state';
import { ConfigActions } from './config.actions';

export const configReducer = createReducer(
  initialConfigState,
  on(ConfigActions.loadConfig, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ConfigActions.loadConfigSuccess, (state, { config }) => ({
    ...state,
    config,
    loading: false,
    error: null,
  })),
  on(ConfigActions.loadConfigFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
