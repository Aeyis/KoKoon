import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {AgendaEvent, NewEvent} from '@core/models/event.interface';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<AgendaEvent[]>{
    return this._http.get<AgendaEvent[]>(`${this._apiUrl}events`);
  }

  create(payload: NewEvent): Observable<AgendaEvent> {
    return this._http.post<AgendaEvent>(`${this._apiUrl}events`, payload);
  }
}
