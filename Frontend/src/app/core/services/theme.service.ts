import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

export type ThemeMode = 'LIGHT' | 'DARK';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  private readonly _theme = signal<ThemeMode>(
    (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'LIGHT',
  );
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'DARK');

  constructor() {
    this._apply(this._theme());
  }

  set(theme: ThemeMode, persist = true): void {
    this._theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this._apply(theme);
    if (persist) {
      this._http.patch(`${this._apiUrl}users/me/theme`, { theme }).subscribe({ error: () => {} });
    }
  }

  toggle(): void {
    this.set(this.isDark() ? 'LIGHT' : 'DARK');
  }

  // Reconcile with the value stored server-side when no local choice was made yet.
  syncFromServer(theme: ThemeMode | null): void {
    if (theme && !localStorage.getItem(STORAGE_KEY)) {
      this.set(theme, false);
    }
  }

  private _apply(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme.toLowerCase());
  }
}
