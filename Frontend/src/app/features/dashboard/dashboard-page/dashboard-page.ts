import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  protected readonly auth = inject(AuthService);

  ngOnInit() {
    this.auth.loadCurrentUser().subscribe();
  }
}
