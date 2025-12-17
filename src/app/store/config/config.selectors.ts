import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigState } from './config.state';

export const selectConfigState = createFeatureSelector<ConfigState>('config');

export const selectConfig = createSelector(selectConfigState, (state) => state.config);

export const selectTaxRate = createSelector(selectConfig, (config) => config?.taxRate ?? 0.2);

export const selectFreeShippingThreshold = createSelector(
  selectConfig,
  (config) => config?.freeShippingThreshold ?? 50,
);

export const selectStandardShippingFee = createSelector(
  selectConfig,
  (config) => config?.standardShippingFee ?? 5.99,
);

export const selectConfigLoading = createSelector(selectConfigState, (state) => state.loading);

export const selectConfigError = createSelector(selectConfigState, (state) => state.error);
