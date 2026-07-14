import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Student, MedicalRecord } from '@core/models/student.interface';
import { AppNotification } from '@core/models/notification.interface';
import { Attendance } from '@core/models/attendance.interface';
import { ClassJournal } from '@core/models/journal.interface';
import { Evaluation } from '@core/models/evaluation.interface';
import { ConductAssessment } from '@core/models/conduct.interface';
import { AgendaEvent } from '@core/models/event.interface';
import {
  ParentProfile,
  UpdateChildMedical,
  UpdateParentProfile,
} from '@core/models/parent-profile.interface';
import { ReportAbsence } from '@core/models/absence.interface';

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

  getChildJournal(childId: number): Observable<ClassJournal[]> {
    return this._http.get<ClassJournal[]>(`${this._apiUrl}me/children/${childId}/journal`);
  }

  getChildEvaluations(childId: number): Observable<Evaluation[]> {
    return this._http.get<Evaluation[]>(`${this._apiUrl}me/children/${childId}/evaluations`);
  }

  getChildConduct(childId: number): Observable<ConductAssessment[]> {
    return this._http.get<ConductAssessment[]>(`${this._apiUrl}me/children/${childId}/conduct`);
  }

  getProfile(): Observable<ParentProfile> {
    return this._http.get<ParentProfile>(`${this._apiUrl}me/profile`);
  }

  updateProfile(body: UpdateParentProfile): Observable<ParentProfile> {
    return this._http.patch<ParentProfile>(`${this._apiUrl}me/profile`, body);
  }

  getChildMedical(childId: number): Observable<MedicalRecord> {
    return this._http.get<MedicalRecord>(`${this._apiUrl}me/children/${childId}/medical`);
  }

  updateChildMedical(childId: number, body: UpdateChildMedical): Observable<MedicalRecord> {
    return this._http.put<MedicalRecord>(`${this._apiUrl}me/children/${childId}/medical`, body);
  }

  getChildEvents(childId: number): Observable<AgendaEvent[]> {
    return this._http.get<AgendaEvent[]>(`${this._apiUrl}me/children/${childId}/events`);
  }

  reportAbsence(childId: number, body: ReportAbsence): Observable<{ success: boolean }> {
    return this._http.post<{ success: boolean }>(
      `${this._apiUrl}me/children/${childId}/absences`,
      body,
    );
  }
}
