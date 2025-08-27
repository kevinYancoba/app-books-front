import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { EmailInputComponent } from "../../shared/components/email-input.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-pass',
  imports: [MatIconModule, MatInputModule, MatButtonModule, RouterLink, EmailInputComponent],
  templateUrl: './reset-pass.component.html',
  standalone: true,
  styles: ''
})
export class ResetPassComponent {

  resetPassForm = new FormGroup({
    email : new FormControl('', [Validators.email, Validators.required])
  })

}
