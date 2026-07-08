import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {Subject} from '@core/models/subject.interface';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<Subject[]> {
    return this._http.get<Subject[]>(`${this._apiUrl}subjects`);
  }
}
