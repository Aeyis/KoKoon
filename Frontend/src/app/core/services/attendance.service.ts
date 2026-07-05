import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '@env';
import { Attendance, CreateAttendance } from '@core/models/attendance.interface';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<Attendance[]> {
    return this._http.get<Attendance[]>(`${this._apiUrl}attendance`);
  }

  create(payload: CreateAttendance): Observable<unknown> {
    return this._http.post(`${this._apiUrl}attendance`, payload);
  }

  createMany(payloads: CreateAttendance[]): Observable<unknown[]> {
    return forkJoin(payloads.map((p) => this.create(p)));
  }
}