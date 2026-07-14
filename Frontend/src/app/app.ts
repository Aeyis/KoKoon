import {Component, computed, inject, signal} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {BottomNav} from '@shared/layout/bottom-nav/bottom-nav';
import {ParentNav} from '@shared/layout/parent-nav/parent-nav';
import {TopBar} from '@shared/layout/top-bar/top-bar';
import {AuthService} from '@core/services/auth.service';
import {ThemeService} from '@core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNav, ParentNav, TopBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
  protected readonly auth = inject(AuthService);
  // Instantiated at bootstrap so the saved theme is applied on load.
  private readonly _theme = inject(ThemeService);
  private readonly _router = inject(Router);

  private readonly _url = signal(this._router.url);
  // Full-screen chat thread: hide the bottom nav so the composer stays reachable.
  protected readonly hideNav = computed(() => /^\/messages\/\d+/.test(this._url()));

  constructor() {
    this._router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this._url.set(e.urlAfterRedirects));
  }
}
