import { Component, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { EmailInputComponent } from '../../shared/components/email-input.component';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { PasswordInputComponent } from '../../shared/components/password-input.component';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    EmailInputComponent,
    PasswordInputComponent,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para el estado del componente
  isLoading = this.authService.isLoading;
  error = this.authService.error;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  }, { validators: this.passwordMatchValidator });

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterRequest = {
        name: this.registerForm.value.name!,
        lastName: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          // Redirigir al login después del registro exitoso
          this.router.navigate(['/auth'], {
            queryParams: { message: 'Registro exitoso. Por favor, inicia sesión.' }
          });
        },
        error: (error) => {
          console.error('Error en registro:', error);
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si las contraseñas no coinciden
   */
  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
           this.registerForm.get('confirmPassword')?.touched || false;
  }
}
