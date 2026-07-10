import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Student } from '@core/models/student.interface';
import { AppNotification } from '@core/models/notification.interface';
import { Attendance } from '@core/models/attendance.interface';

@Injectable({ providedIn: 'root' })
export class MeService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getChildren(): Observable<Student[]> {
    return this._http.get<Student[]>(`${this._apiUrl}me/children`);
  }

  getNotifications(): Observable<AppNotification[]> {
    return this._http.get<AppNotification[]>(`${this._apiUrl}me/notifications`);
  }

  getChildAttendance(childId: number): Observable<Attendance[]> {
    return this._http.get<Attendance[]>(`${this._apiUrl}me/children/${childId}/attendance`);
  }
}
