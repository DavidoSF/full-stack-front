export interface ErrorResponseModel {
  status?: number;
  success?: boolean;
  response?: string;
  errors?: Record<string, string>;
  error?: Record<string, string>;
  email?: string;
  message?: string;
}
