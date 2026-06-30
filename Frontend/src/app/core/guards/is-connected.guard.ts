import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@core/services/auth.service';

export const isConnectedGuard: CanActivateFn = () => {
  const auth= inject(AuthService);
  const router = inject(Router);

  if (auth.isConnected()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
