import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ClassRoom, NewClass } from '@core/models/class.interface';
import { SeatingPlan } from '@core/models/seating.interface';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<ClassRoom[]> {
    return this._http.get<ClassRoom[]>(`${this._apiUrl}classes`);
  }

  create(body: NewClass): Observable<ClassRoom> {
    return this._http.post<ClassRoom>(`${this._apiUrl}classes`, body);
  }

  getSeating(classId: number): Observable<SeatingPlan | null> {
    return this._http.get<SeatingPlan | null>(`${this._apiUrl}classes/${classId}/seating`);
  }

  setSeating(classId: number, plan: SeatingPlan): Observable<SeatingPlan> {
    return this._http.put<SeatingPlan>(`${this._apiUrl}classes/${classId}/seating`, plan);
  }
}
