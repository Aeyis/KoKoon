import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Period } from '@core/models/period.interface';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<Period[]> {
    return this._http.get<Period[]>(`${this._apiUrl}periods`);
  }
}
