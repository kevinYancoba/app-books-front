import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Interceptor funcional para manejar errores HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 401:
            // Token inválido o expirado
            authService.logout();
            router.navigate(['/auth']);
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor.';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
        }
      }

      console.error('HTTP Error:', error);
      
      // Retorna el error con el mensaje personalizado
      return throwError(() => ({
        ...error,
        customMessage: errorMessage
      }));
    })
  );
};
