import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-plan-card-detail',
  imports: [MatCardModule, MatCheckboxModule, FormsModule, MatIconModule],
  templateUrl: './plan-card-detail.component.html',
  styleUrl: './plan-card-detail.component.css'
})
export class PlanCardDetailComponent {

}
