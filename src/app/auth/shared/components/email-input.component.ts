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
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

@Component({
  selector: 'email-input',
  imports: [MatInputModule, ReactiveFormsModule],
  template: `
    <mat-form-field appearance="outline" [class]="matFormFielClass" >
      <mat-label>Correo</mat-label>
      <input
        matInput
        [formControl]="emailControl"
        (blur)="updateErrorMessage()"
        required
      />

      @if (emailControl.invalid && (emailControl.touched || emailControl.dirty)) {
      <mat-error>{{ errorMessage() }}</mat-error>
      }

    </mat-form-field>
  `,
  styles: '',
})
export class EmailInputComponent implements OnInit{

  @Input({ required: true }) emailControl!: FormControl;
  @Input() matFormFielClass: string = '';
  errorMessage = signal('');

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    merge(this.emailControl.statusChanges, this.emailControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.emailControl.hasError('required')) {
      this.errorMessage.set('la correo no puede ser vacio');
    } else if (this.emailControl.hasError('email')) {
      this.errorMessage.set('el correo no es valido');
    } else {
      this.errorMessage.set('');
    }
  }

}
