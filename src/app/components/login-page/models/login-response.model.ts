import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { RefreshTokenModel } from './refresh-token.model';
import { UserProfile } from './user-profile.model';

export interface LoginResponseModel extends CommonResponseModel {
  access: string;
  refresh: string;
  user: UserProfile;
}
