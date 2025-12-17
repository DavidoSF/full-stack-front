import { StoreConfig } from '../../shared/models/config.model';

export interface ConfigState {
  config: StoreConfig | null;
  loading: boolean;
  error: string | null;
}

export const initialConfigState: ConfigState = {
  config: null,
  loading: false,
  error: null,
};
