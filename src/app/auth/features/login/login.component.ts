import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { EmailInputComponent } from '../../shared/components/email-input.component';
import { PasswordInputComponent } from '../../shared/components/password-input.component';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { LoginRequest } from '../../interfaces';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    EmailInputComponent,
    PasswordInputComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  isLoading = this.authService.isLoading;
  error = this.authService.error;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  });

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          this.navigationService.navigateAfterLogin();
        },
        error: (error) => {
          console.error('Error en login:', error);
          // El error ya se maneja en el servicio
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
