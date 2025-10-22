import { Routes } from '@angular/router';
import authRoutes from './auth/auth.routes';
import { LoginLayoutComponent } from './core/layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './core/layout/home-layout/home-layout.component';
import planRoutes from './features/plans/plans.routes';
import planDetailRoutes from './features/plan-detail/plan-detail.routes';
import progressRoutes from './features/Progress/progress.routes';
import { authGuard, noAuthGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'auth',
    component : LoginLayoutComponent,
    canActivate: [noAuthGuard],
    children : authRoutes
  },
  {
    path: 'home',
    component : HomeLayoutComponent,
    canActivate: [authGuard],
    children :[
      {
        path: 'plans',
        children: planRoutes
      },
      {
        path: 'plan-detail',
        children: planDetailRoutes
      }
    ]
  },
  {
    path : "**",
    redirectTo : 'auth'
  }
];
