import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MatTimepicker,
  MatTimepickerModule,
  MatTimepickerOption,
} from '@angular/material/timepicker';

@Component({
  selector: 'app-plan-stepper',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTimepickerModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './plan-stepper.component.html',
})
export class PlanStepperComponent {
  nivelLectura = signal([
    { value: 'novato', viewValue: 'Novato' },
    { value: 'intermedio', viewValue: 'Intermedio' },
    { value: 'profesional', viewValue: 'Profesional' },
    { value: 'experto', viewValue: 'Experto' },
  ]);

  customOptions: MatTimepickerOption<Date>[] = [
    { label: 'Mañana', value: new Date(2025, 0, 1, 9, 0, 0) },
    { label: 'Noche', value: new Date(2025, 0, 1, 12, 0, 0) },
    { label: 'Tarde', value: new Date(2025, 0, 1, 22, 0, 0) },
  ];

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  isLinear = false;
}
