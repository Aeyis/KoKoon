import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BottomNav} from '@shared/layout/bottom-nav/bottom-nav';
import {TopBar} from '@shared/layout/top-bar/top-bar';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNav, TopBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
  protected readonly auth = inject(AuthService);
}
