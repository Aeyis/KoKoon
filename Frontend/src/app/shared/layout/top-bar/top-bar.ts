import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { ContextSwitcher } from '../context-switcher/context-switcher';

@Component({
  selector: 'app-top-bar',
  imports: [MatIcon, RouterLink, ContextSwitcher],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  protected readonly auth = inject(AuthService);
}
