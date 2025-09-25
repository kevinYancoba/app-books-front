import { Routes } from '@angular/router';
import authRoutes from './auth/auth.routes';
import { LoginLayoutComponent } from './core/layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './core/layout/home-layout/home-layout.component';
import planRoutes from './features/plans/plans.routes';

export const routes: Routes = [
  {
    path: 'auth',
    component : LoginLayoutComponent,
    children : authRoutes
  },
  {
    path: 'home',
    component : HomeLayoutComponent,
    children : planRoutes
  },
  {
    path : "**",
    redirectTo : 'auth'
  }
];
