import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats } from '../../../store/admin/admin.state';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = '/api/admin/stats/';

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(this.apiUrl);
  }
}
