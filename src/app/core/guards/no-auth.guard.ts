import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Guard funcional que previene el acceso a rutas de autenticación 
 * cuando el usuario ya está logueado
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isUserAuthenticated()) {
    return true;
  }

  // Redirige al home si ya está autenticado
  router.navigate(['/home/plans']);
  return false;
};
