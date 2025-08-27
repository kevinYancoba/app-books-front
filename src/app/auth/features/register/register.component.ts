import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { EmailInputComponent } from '../../shared/components/email-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordInputComponent } from '../../shared/components/password-input.component';

@Component({
  selector: 'app-register',
  imports: [
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
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(15),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(15),
    ]),
  });
}
