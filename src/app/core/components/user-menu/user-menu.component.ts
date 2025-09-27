import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../auth/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDivider
],
  template: `
    <div class="flex items-center gap-2">
      @if (authService.isAuthenticated()) {
        <span class="text-sm">
          Hola, {{ authService.currentUser()?.name }}
        </span>

        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Perfil</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Configuración</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
      }
    </div>
  `
})
export class UserMenuComponent {
  authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  logout(): void {
    this.authService.logout();
    this.navigationService.navigateAfterLogout();
  }
}
