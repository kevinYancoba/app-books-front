import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

@Component({
  selector: 'password-input',
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-form-field appearance="outline" [class]="matFormFielClass">
      <mat-label>{{ labelInputPass }}</mat-label>
      <input
        matInput
        [formControl]="passwordControl"
        [type]="hide() ? 'password' : 'text'"
        minlength="8"
        maxlength="15"
        (blur)="updateErrorMessage()"
        required
      />
      <button
        mat-icon-button
        matSuffix
        (click)="clickEvent($event)"
        [attr.aria-label]="'Hide password'"
        [attr.aria-pressed]="hide()"
        type="button"
      >
        <mat-icon>{{ hide() ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
      @if (passwordControl.invalid && (passwordControl.touched ||
      passwordControl.dirty)) {
      <mat-error>{{ errorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: ``,
})
export class PasswordInputComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  @Input({ required: true }) passwordControl!: FormControl;
  @Input() matFormFielClass: string = '';
  @Input() labelInputPass: string = '';

  hide = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    merge(this.passwordControl.statusChanges, this.passwordControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.passwordControl.hasError('required')) {
      this.errorMessage.set('la contraseña no puede estar vacia');
    } else if (this.passwordControl.hasError('minlength')) {
      this.errorMessage.set('la contrasena debe ser mayor a 7 caracteres');
    } else if (this.passwordControl.hasError('maxlength')) {
      this.errorMessage.set('La contraseña no puede exceder los 15 caracteres');
    } else {
      this.errorMessage.set('');
    }
  }
}
