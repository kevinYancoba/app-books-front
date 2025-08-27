import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegisterComponent } from "./auth/features/register/register.component";
import { ResetPassComponent } from "./auth/features/reset-pass/reset-pass.component";
import {LoginComponent} from "./auth/features/login/login.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
