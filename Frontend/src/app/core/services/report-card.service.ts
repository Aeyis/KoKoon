import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ReportCard } from '@core/models/report-card.interface';

@Injectable({ providedIn: 'root' })
export class ReportCardService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<ReportCard[]> {
    return this._http.get<ReportCard[]>(`${this._apiUrl}report-cards`);
  }

  publish(studentId: number, periodId: number): Observable<ReportCard> {
    return this._http.post<ReportCard>(`${this._apiUrl}report-cards`, {
      studentId,
      periodId,
      status: 'PUBLISHED',
    });
  }

  /** Upsert du bulletin : n'écrase que les champs fournis */
  saveComment(
    studentId: number,
    periodId: number,
    patch: { comment?: string; conductComment?: string },
  ): Observable<ReportCard> {
    return this._http.post<ReportCard>(`${this._apiUrl}report-cards`, {
      studentId,
      periodId,
      ...patch,
    });
  }
}
