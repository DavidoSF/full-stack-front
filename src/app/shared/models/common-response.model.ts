import { ErrorResponseModel } from './error-response.model';

export interface CommonResponseModel extends ErrorResponseModel {
  success?: boolean;
  response?: string;
  errors?: { [key: string]: string };
  email?: string;
}
