import { Injectable } from '@angular/core';
import { LoginRequestModel } from '../models/login-request.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponseModel } from '../models/login-response.model';
import { UserProfile } from '../models/user-profile.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>('/api/auth/token/', request);
  }

  refreshToken(): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>('/api/auth/token/refresh/', {});
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/me/`);
  }
}
