import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Guard funcional que protege rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Redirige al login si no está autenticado
  router.navigate(['/auth'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
