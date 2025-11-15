export interface ErrorResponseModel {
  status?: number;
  success?: boolean;
  response?: string;
  errors?: { [key: string]: string };
  error?: { [key: string]: string };
  email?: string;
  message?: string;
}
