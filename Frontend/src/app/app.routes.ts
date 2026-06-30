import { Routes } from '@angular/router';
import {isConnectedGuard} from '@core/guards/is-connected.guard';

export const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path:'dashboard',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/dashboard/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'class',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/class/class-page/class-page').then((m) => m.ClassPage),
  },
  {
    path: 'class-journal',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/class-journal/class-journal-page/class-journal-page').then((m) => m.ClassJournalPage),
  },
  {
    path: 'report-card',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/report-card/report-card-page/report-card-page').then((m) => m.ReportCardPage),
  },
  {
    path: 'agenda',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/agenda/agenda-page/agenda-page').then((m) => m.AgendaPage),
  },
];
