import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { PlanStepperComponent } from "../plan-stepper/plan-stepper.component";


@Component({
  selector: 'app-plan-dialog',
  imports: [MatDialogModule, MatButtonModule, PlanStepperComponent],
  templateUrl: './plan-dialog.component.html',
  styleUrl: './plan-dialog.component.css'
})
export class PlanDialogComponent {

}
