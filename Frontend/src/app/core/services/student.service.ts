import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student, StudentDetail} from '@core/models/student.interface';
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
}
