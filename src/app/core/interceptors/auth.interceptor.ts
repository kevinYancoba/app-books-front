import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Interceptor funcional que agrega el token JWT a las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si no hay token, continúa con la petición original
  if (!token) {
    return next(req);
  }

  // Clona la petición y agrega el header de autorización
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq);
};
