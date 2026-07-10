import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export const isParentGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isConnected()) return router.createUrlTree(['/login']);
  if (!auth.isParent()) return router.createUrlTree(['/dashboard']);
  return true;
};
