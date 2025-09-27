import { HomePlansComponent } from './pages/home-plans/home-plans.component';
import { Routes } from "@angular/router";

const planRoutes : Routes = [

  {
    path: '',
    loadComponent: () => import("../plans/pages/home-plans/home-plans.component").then(c => c.HomePlansComponent)
  },
]

export default planRoutes;
