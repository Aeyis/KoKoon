import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { AppNotification } from '@core/models/notification.interface';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-parent-home-page',
  imports: [RouterLink, MatIcon, StudentAvatar],
  templateUrl: './parent-home-page.html',
  styleUrl: './parent-home-page.scss',
})
export class ParentHomePage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly _meService = inject(MeService);

  protected readonly children = signal<Student[]>([]);
  protected readonly notifications = signal<AppNotification[]>([]);

  ngOnInit(): void {
    this.auth.loadCurrentUser().subscribe();
    this._meService.getChildren().subscribe((list) => this.children.set(list));
    this._meService.getNotifications().subscribe((list) => this.notifications.set(list));
  }

  protected notifDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short' });
  }
}
