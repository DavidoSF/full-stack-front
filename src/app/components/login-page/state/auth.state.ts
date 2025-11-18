import { ErrorResponseModel } from '../../../shared/models/error-response.model';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { UserProfile } from '../models/user-profile.model';

export interface AuthState {
  loading?: boolean;
  token?: RefreshTokenModel;
  error?: ErrorResponseModel;
  user?: UserProfile;
}
