import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StoreConfig } from '../../shared/models/config.model';

export const ConfigActions = createActionGroup({
  source: 'Config',
  events: {
    'Load Config': emptyProps(),
    'Load Config Success': props<{ config: StoreConfig }>(),
    'Load Config Failure': props<{ error: string }>(),
  },
});
