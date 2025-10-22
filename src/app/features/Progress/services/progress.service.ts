import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressReport } from '../models/progress-report.model';
import { BaseHttpService } from '../../../core/services/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  constructor(private baseHttp: BaseHttpService) {}
  private http = inject(HttpClient);
  private apiUrl = '/reports';

  getProgressReport(): Observable<ProgressReport> {
    const userId = this.getUserId();
    return this.baseHttp.get<ProgressReport>(`${this.apiUrl}/overview/${userId}`);
  }

  private getUserId(): string {
    const user = localStorage.getItem('trackbook_user');

    const userId = user ? JSON.parse(user).id : null;

    if (userId) {
      return userId;
    }
    return '';
  }
}

