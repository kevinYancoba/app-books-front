import { Component } from '@angular/core';
import { PlanListComponent } from "../../components/plan-list/plan-list.component";

@Component({
  selector: 'app-home-plans',
  imports: [PlanListComponent],
  templateUrl: './home-plans.component.html',
  styleUrl: './home-plans.component.css'
})
export class HomePlansComponent {

}
