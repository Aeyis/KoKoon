import { Routes } from '@angular/router';
import {isConnectedGuard} from '@core/guards/is-connected.guard';
import { isParentGuard } from '@core/guards/is-parent.guard';
import { authOnlyGuard } from '@core/guards/auth-only.guard';

export const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('@features/auth/onboarding-page/onboarding-page').then((m) => m.OnboardingPage),
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
    path: 'class/:id',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/class/student-detail-page/student-detail-page').then((m) => m.StudentDetailPage),
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
    path: 'report-card/:id',
    canActivate: [isConnectedGuard],
    loadComponent: () =>
      import('@features/report-card/student-report-page/student-report-page').then(
        (m) => m.StudentReportPage,
      ),
  },
  {
    path: 'report-card/:id/behavior',
    canActivate: [isConnectedGuard],
    loadComponent: () =>
      import('@features/report-card/student-conduct-page/student-conduct-page').then(
        (m) => m.StudentConductPage,
      ),
  },
  {
    path: 'agenda',
    canActivate: [isConnectedGuard],
    loadComponent:() =>
      import('@features/agenda/agenda-page/agenda-page').then((m) => m.AgendaPage),
  },
  {
    path: 'settings',
    canActivate: [authOnlyGuard],
    loadComponent: () =>
      import('@features/settings/settings-page/settings-page').then((m) => m.SettingsPage),
  },
  {
    path: 'messages',
    canActivate: [authOnlyGuard],
    loadComponent: () =>
      import('@features/messages/messages-page/messages-page').then((m) => m.MessagesPage),
  },
  {
    path: 'messages/:userId',
    canActivate: [authOnlyGuard],
    loadComponent: () =>
      import('@features/messages/conversation-page/conversation-page').then(
        (m) => m.ConversationPage,
      ),
  },
  {
    path: 'parent',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/parent-home-page/parent-home-page').then((m) => m.ParentHomePage),
  },
  {
    path: 'parent/journal',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/parent-journal-page/parent-journal-page').then(
        (m) => m.ParentJournalPage,
      ),
  },
  {
    path: 'parent/report',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/parent-report-page/parent-report-page').then(
        (m) => m.ParentReportPage,
      ),
  },
  {
    path: 'parent/records',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/parent-records-page/parent-records-page').then(
        (m) => m.ParentRecordsPage,
      ),
  },
  {
    path: 'parent/agenda',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/parent-agenda-page/parent-agenda-page').then(
        (m) => m.ParentAgendaPage,
      ),
  },
  {
    path: 'parent/child/:id',
    canActivate: [isParentGuard],
    loadComponent: () =>
      import('@features/parent/child-detail-page/child-detail-page').then((m) => m.ChildDetailPage),
  },
];
