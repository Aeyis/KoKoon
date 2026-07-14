import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student, StudentDetail} from '@core/models/student.interface';
import {NewStudent, InviteGuardianResult, InviteGuardian} from '@core/models/student.interface';
import {environment} from '@env';

@Injectable({providedIn: 'root'})
export class StudentService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<Student[]> {
    return this._http.get<Student[]>(`${this._apiUrl}students`);
  }

  getOne(id: number): Observable<StudentDetail> {
    return this._http.get<StudentDetail>(`${this._apiUrl}students/${id}`);
  }

  create(body: NewStudent): Observable<Student> {
    return this._http.post<Student>(`${this._apiUrl}students`, body);
  }

  getAvailable(): Observable<Student[]> {
    return this._http.get<Student[]>(`${this._apiUrl}students/available`);
  }

  assignClass(studentId: number, classId: number | null): Observable<Student> {
    return this._http.patch<Student>(`${this._apiUrl}students/${studentId}/assign`, { classId });
  }

  inviteGuardian(studentId: number, body: InviteGuardian): Observable<InviteGuardianResult> {
    return this._http.post<InviteGuardianResult>(
      `${this._apiUrl}students/${studentId}/invite-guardian`,
      body,
    );
  }
}
