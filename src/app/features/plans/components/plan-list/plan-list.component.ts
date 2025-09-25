import { Component, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { PlanCardComponent } from "../plan-card/plan-card.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-plan-list',
  imports: [MatExpansionModule, PlanCardComponent, MatProgressBarModule, MatIconModule],
  templateUrl: './plan-list.component.html',
})
export class PlanListComponent {
   readonly panelOpenState = signal(false);

}
