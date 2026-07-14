import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

// Any authenticated user (teacher or parent), no role-based redirect.
export const authOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isConnected()) {
    return router.createUrlTree(['/login']);
  }
  return true;
};
