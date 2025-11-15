import { CommonResponseModel } from '../../../shared/models/common-response.model';
import { RefreshTokenModel } from './refresh-token.model';

export interface LoginResponseModel extends CommonResponseModel {
  token: RefreshTokenModel;
}
