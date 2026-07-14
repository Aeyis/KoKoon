import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/enums/user-role.enum';

// Direction (PRINCIPAL) et ADMIN uniquement.
export const isPrincipalGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isConnected()) return router.createUrlTree(['/login']);
  const role = auth.role();
  if (role === UserRole.ADMIN || role === UserRole.PRINCIPAL) return true;
  if (auth.isParent()) return router.createUrlTree(['/parent']);
  return router.createUrlTree(['/dashboard']);
};
