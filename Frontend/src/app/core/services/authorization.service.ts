import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Teacher, ClassTeacherLink } from '@core/models/teacher.interface';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getTeachers(): Observable<Teacher[]> {
    return this._http.get<Teacher[]>(`${this._apiUrl}users/teachers`);
  }

  addStaff(schoolId: number, userId: number): Observable<unknown> {
    return this._http.post(`${this._apiUrl}schools/${schoolId}/staff/${userId}`, {});
  }

  removeStaff(schoolId: number, userId: number): Observable<unknown> {
    return this._http.delete(`${this._apiUrl}schools/${schoolId}/staff/${userId}`);
  }

  getClassTeachers(): Observable<ClassTeacherLink[]> {
    return this._http.get<ClassTeacherLink[]>(`${this._apiUrl}class-teachers`);
  }

  addClassTeacher(teacherId: number, classeId: number): Observable<unknown> {
    return this._http.post(`${this._apiUrl}class-teachers`, {
      teacherId,
      classeId,
      role: 'LEAD',
    });
  }

  removeClassTeacher(linkId: number): Observable<unknown> {
    return this._http.delete(`${this._apiUrl}class-teachers/${linkId}`);
  }
}
