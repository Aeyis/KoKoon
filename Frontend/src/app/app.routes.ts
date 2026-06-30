import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login-page/login-page').then((m) => m.LoginPage),
  },
];
