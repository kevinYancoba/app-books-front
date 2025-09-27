import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { EmailInputComponent } from "../../shared/components/email-input.component";
import { PasswordInputComponent } from "../../shared/components/password-input.component";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EmailResetRequest, PasswordResetRequest } from '../../interfaces';

@Component({
  selector: 'app-reset-pass',
  imports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterLink,
    EmailInputComponent,
    PasswordInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './reset-pass.component.html',
  standalone: true,
  styles: ''
})
export class ResetPassComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados del componente
  currentStep = signal<'email' | 'code' | 'password'>('email');
  isLoading = this.authService.isLoading;
  error = this.authService.error;
  userEmail = signal<string>('');

  // Formulario para solicitar código
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  });

  // Formulario para verificar código
  codeForm = new FormGroup({
    digit1: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    digit2: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    digit3: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    digit4: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
  });

  // Formulario para nueva contraseña
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  /**
   * Solicita código de reset por email
   */
  requestCode(): void {
    if (this.emailForm.valid) {
      const emailRequest: EmailResetRequest = {
        email: this.emailForm.value.email!
      };

      this.authService.requestPasswordReset(emailRequest).subscribe({
        next: (response) => {
          console.log('Código enviado:', response);
          this.userEmail.set(this.emailForm.value.email!);
          this.currentStep.set('code');
        },
        error: (error) => {
          console.error('Error al enviar código:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.emailForm);
    }
  }

  /**
   * Verifica el código ingresado
   */
  verifyCode(): void {
    if (this.codeForm.valid) {
      const code = Object.values(this.codeForm.value).join('');
      // Aquí solo validamos que el código esté completo
      // La validación real se hará en el backend al cambiar la contraseña
      this.currentStep.set('password');
    } else {
      this.markFormGroupTouched(this.codeForm);
    }
  }

  /**
   * Actualiza la contraseña
   */
  updatePassword(): void {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password!;
      const confirmPassword = this.passwordForm.value.confirmPassword!;

      if (password !== confirmPassword) {
        // Manejar error de contraseñas no coinciden
        return;
      }

      const code = Object.values(this.codeForm.value).join('');
      const resetRequest: PasswordResetRequest = {
        email: this.userEmail(),
        password: password,
        code: code
      };

      this.authService.updatePassword(resetRequest).subscribe({
        next: (response) => {
          console.log('Contraseña actualizada:', response);
          this.router.navigate(['/home/plans']);
        },
        error: (error) => {
          console.error('Error al actualizar contraseña:', error);
          // Si el código es inválido, volver al paso del código
          if (error.status === 400) {
            this.currentStep.set('code');
            this.codeForm.reset();
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  /**
   * Reenvía el código
   */
  resendCode(): void {
    const emailRequest: EmailResetRequest = {
      email: this.userEmail()
    };

    this.authService.requestPasswordReset(emailRequest).subscribe({
      next: (response) => {
        console.log('Código reenviado:', response);
      },
      error: (error) => {
        console.error('Error al reenviar código:', error);
      }
    });
  }

  /**
   * Vuelve al paso anterior
   */
  goBack(): void {
    switch (this.currentStep()) {
      case 'code':
        this.currentStep.set('email');
        break;
      case 'password':
        this.currentStep.set('code');
        break;
      default:
        this.router.navigate(['/auth']);
    }
  }

  /**
   * Maneja el input de los dígitos del código
   */
  onDigitInput(event: any, nextInput?: HTMLInputElement): void {
    const value = event.target.value;
    if (value && nextInput) {
      nextInput.focus();
    }
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si las contraseñas coinciden
   */
  get passwordMismatch(): boolean {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return password !== confirmPassword &&
           this.passwordForm.get('confirmPassword')?.touched || false;
  }
}
