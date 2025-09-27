import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * Navega a la página principal después del login
   */
  navigateAfterLogin(): void {
    // Obtener la URL de retorno de los query params si existe
    const returnUrl = this.getReturnUrl();
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/home/plans']);
    }
  }

  /**
   * Navega al login después del logout
   */
  navigateAfterLogout(): void {
    this.router.navigate(['/auth']);
  }

  /**
   * Obtiene la URL de retorno de los query parameters
   */
  private getReturnUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl');
  }

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  canAccessRoute(route: string): boolean {
    const isAuthenticated = this.authService.isUserAuthenticated();
    
    // Rutas que requieren autenticación
    const protectedRoutes = ['/home'];
    
    // Rutas que no requieren autenticación
    const publicRoutes = ['/auth'];
    
    if (protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute))) {
      return isAuthenticated;
    }
    
    if (publicRoutes.some(publicRoute => route.startsWith(publicRoute))) {
      return !isAuthenticated;
    }
    
    return true;
  }
}
