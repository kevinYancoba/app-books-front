import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MainToolbarComponent } from "../../components/main-toolbar.component";

@Component({
  selector: 'app-home-layout',
  imports: [RouterModule, MainToolbarComponent],
  templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent {

}
