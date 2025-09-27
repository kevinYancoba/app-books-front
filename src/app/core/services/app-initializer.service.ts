import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private authService = inject(AuthService);

  /**
   * Inicializa la aplicación verificando el estado de autenticación
   */
  async initialize(): Promise<void> {
    try {
      // El AuthService ya inicializa el estado desde localStorage en su constructor
      // Aquí podríamos agregar validaciones adicionales como verificar si el token es válido
      
      if (this.authService.getToken()) {
        console.log('Usuario autenticado encontrado');
        // Aquí podríamos hacer una llamada al backend para validar el token
        // y obtener información actualizada del usuario
      } else {
        console.log('No hay sesión activa');
      }
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      // En caso de error, limpiar cualquier dato corrupto
      this.authService.logout();
    }
  }
}

/**
 * Factory function para el APP_INITIALIZER
 */
export function appInitializerFactory(appInitializer: AppInitializerService) {
  return () => appInitializer.initialize();
}
