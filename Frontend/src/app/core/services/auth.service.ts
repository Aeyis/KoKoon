import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {Observable, tap} from 'rxjs';
import {LoginPayload, LoginResponse} from '@core/models/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  private readonly _token = signal<string | null> (localStorage.getItem('token'));
  readonly token = this._token.asReadonly();
  readonly isConnected = computed(()=> !!this.token());

  login(payload: LoginPayload): Observable<LoginResponse>{
    return this._http.post<LoginResponse>(`${this._apiUrl}auth/login`, payload).pipe(
      tap((res)=> {
        this._token.set(res.access_token);
        localStorage.setItem('token', res.access_token);
      }),
    );
  }
  logout(): void {
    this._token.set(null);
    localStorage.removeItem('token');
  }
}
