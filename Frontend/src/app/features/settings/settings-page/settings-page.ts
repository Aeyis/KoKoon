import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { UserRole } from '@core/enums/user-role.enum';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-settings-page',
  imports: [StudentAvatar],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  private readonly _router = inject(Router);

  protected readonly roleLabel = computed(() => {
    switch (this.auth.currentUser()?.role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.PRINCIPAL:
        return 'Principal';
      case UserRole.TEACHER:
        return 'Teacher';
      case UserRole.RESPONSABLE:
        return 'Parent';
      default:
        return '';
    }
  });

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe((user) => this.theme.syncFromServer(user.theme));
  }

  protected toggleTheme(): void {
    this.theme.toggle();
  }

  protected logout(): void {
    this.auth.logout();
    this._router.navigate(['/login']);
  }
}
