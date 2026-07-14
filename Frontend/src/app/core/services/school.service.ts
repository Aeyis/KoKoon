import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { School } from '@core/models/school.interface';

@Injectable({ providedIn: 'root' })
export class SchoolService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getMine(): Observable<School[]> {
    return this._http.get<School[]>(`${this._apiUrl}schools/mine`);
  }

  getAll(): Observable<School[]> {
    return this._http.get<School[]>(`${this._apiUrl}schools`);
  }
}
