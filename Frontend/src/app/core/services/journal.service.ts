import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {ClassJournal, NewJournalEntry} from '@core/models/journal.interface';

@Injectable ({providedIn: 'root'})
export class JournalService {
  private readonly _http = inject(HttpClient)
  private readonly _apiUrl = environment.apiURL;

  getAll(): Observable<ClassJournal[]> {
    return this._http.get<ClassJournal[]>(`${this._apiUrl}class-journals`);
  }

  setDone(id: number, done: boolean): Observable<ClassJournal> {
    return this._http.patch<ClassJournal>(`${this._apiUrl}class-journals/${id}`, {done});
  }
  create(payload: NewJournalEntry): Observable<ClassJournal> {
    return this._http.post<ClassJournal>(`${this._apiUrl}class-journals`, payload);
  }

  move(id: number, date: string, period: number): Observable<ClassJournal> {
    return this._http.patch<ClassJournal>(`${this._apiUrl}class-journals/${id}`, { date, period });
  }

  update(id: number, patch: Partial<NewJournalEntry>): Observable<ClassJournal> {
    return this._http.patch<ClassJournal>(`${this._apiUrl}class-journals/${id}`, patch);
  }
}
