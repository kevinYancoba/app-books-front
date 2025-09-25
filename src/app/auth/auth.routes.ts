import { Routes } from "@angular/router";

const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import("./features/login/login.component").then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent : () => import("./features/register/register.component").then(c => c.RegisterComponent)
  },
  {
    path: 'reset-pass',
    loadComponent : () => import("./features/reset-pass/reset-pass.component").then(c => c.ResetPassComponent)
  },
  {
    path: "**",
    loadComponent: () => import("./features/login/login.component").then(c => c.LoginComponent)
  }

];

export default authRoutes;
