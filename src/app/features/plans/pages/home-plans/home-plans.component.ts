import { Component } from '@angular/core';
import { PlanListComponent } from "../../components/plan-list/plan-list.component";
import { MainButtonComponent } from "../../components/main-button/main-button.component";

@Component({
  selector: 'app-home-plans',
  imports: [PlanListComponent, MainButtonComponent],
  templateUrl: './home-plans.component.html',
  styleUrl: './home-plans.component.css'
})
export class HomePlansComponent {

}
