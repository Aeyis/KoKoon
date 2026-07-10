import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-top-bar',
  imports: [MatIcon],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  logout(): void {
    this._auth.logout();
    this._router.navigate(['/login']);
  }
}
