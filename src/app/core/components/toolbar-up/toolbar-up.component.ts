import { Component, inject } from '@angular/core';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-toolbar-up',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar-up.component.html',
})
export class ToolbarUpComponent {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  // Signals públicos para el template
  readonly isDarkMode = this.themeService.isDarkMode;
  readonly isAuthenticated = this.authService.isAuthenticated;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.navigationService.navigateAfterLogout();
  }
}
