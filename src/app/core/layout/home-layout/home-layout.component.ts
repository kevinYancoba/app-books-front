import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { MainToolbarComponent } from "../../components/toolbar-down/main-toolbar.component";
import { ToolbarUpComponent } from "../../components/toolbar-up/toolbar-up.component";

@Component({
  selector: 'app-home-layout',
  imports: [RouterModule, MainToolbarComponent, ToolbarUpComponent],
  templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent {

}
