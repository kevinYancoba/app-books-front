import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { PlanCardDetailComponent } from "../plan-card-detail/plan-card-detail.component";

@Component({
  selector: 'app-plan-card-detail-list',
   imports: [MatListModule, MatDividerModule, PlanCardDetailComponent],
  templateUrl: './plan-card-detail-list.component.html',
  styleUrl: './plan-card-detail-list.component.css'
})
export class PlanCardDetailListComponent {

}
