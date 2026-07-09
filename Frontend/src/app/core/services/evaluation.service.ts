import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Evaluation } from '@core/models/evaluation.interface';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<Evaluation[]> {
    return this._http.get<Evaluation[]>(`${this._apiUrl}evaluations`);
  }
}
