import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ConductItem, ConductAssessment } from '@core/models/conduct.interface';
import { ConductLevel } from '@core/enums/conduct.enum';

@Injectable({ providedIn: 'root' })
export class ConductService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getItems(): Observable<ConductItem[]> {
    return this._http.get<ConductItem[]>(`${this._apiUrl}conduct/items`);
  }

  getAssessments(): Observable<ConductAssessment[]> {
    return this._http.get<ConductAssessment[]>(`${this._apiUrl}conduct/assessments`);
  }

  setLevel(
    studentId: number,
    itemId: number,
    periodId: number,
    level: ConductLevel,
  ): Observable<ConductAssessment> {
    return this._http.post<ConductAssessment>(`${this._apiUrl}conduct/assessments`, {
      studentId,
      itemId,
      periodId,
      level,
    });
  }
}
