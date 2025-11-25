import { createAction, props } from '@ngrx/store';
import { LoginRequestModel } from '../models/login-request.model';
import { LoginResponseModel } from '../models/login-response.model';
import { ErrorResponseModel } from '../../../shared/models/error-response.model';
import { RefreshTokenModel } from '../models/refresh-token.model';

export class AuthActions {
  static login = createAction('[Auth] Login', props<{ request: LoginRequestModel }>());
  static loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ response: LoginResponseModel }>(),
  );
  static loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: ErrorResponseModel }>(),
  );
  static refreshToken = createAction('[Auth] Refresh Token');
  static refreshTokenSuccess = createAction(
    '[Auth] Refresh Token Success',
    props<{ response: RefreshTokenModel }>(),
  );
  static refreshTokenFailure = createAction(
    '[Auth] Refresh Token Failure',
    props<{ error: ErrorResponseModel }>(),
  );

  static logout = createAction('[Auth] Logout');
  static loadAuthFromStorage = createAction('[Auth] Load From Storage');
  static loadAuthFromStorageSuccess = createAction(
    '[Auth] Load From Storage Success',
    props<{ response: LoginResponseModel }>(),
  );
}
