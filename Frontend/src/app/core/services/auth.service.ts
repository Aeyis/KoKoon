import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {Observable, tap} from 'rxjs';
import {LoginPayload, LoginResponse} from '@core/models/auth.interface';
import { User } from '@core/models/user.interface';
import { UserRole } from '@core/enums/user-role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  private readonly _token = signal<string | null> (localStorage.getItem('token'));
  readonly token = this._token.asReadonly();
  readonly isConnected = computed(()=> !!this.token());

  readonly role = computed<UserRole | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split('.')[1])).role ?? null;
    } catch {
      return null;
    }
  });

  readonly isParent = computed(() => this.role() === UserRole.RESPONSABLE);

  private readonly _currentUser = signal <User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  loadCurrentUser(): Observable<User>{
    return this._http.get<User>(`${this._apiUrl}users/me`).pipe(
      tap((user) => this._currentUser.set(user)),
    );
  }

  login(payload: LoginPayload): Observable<LoginResponse>{
    return this._http.post<LoginResponse>(`${this._apiUrl}auth/login`, payload).pipe(
      tap((res)=> {
        this._token.set(res.access_token);
        localStorage.setItem('token', res.access_token);
      }),
    );
  }

  acceptInvitation(token: string, password: string): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${this._apiUrl}auth/accept-invitation`, { token, password })
      .pipe(
        tap((res) => {
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
