import { Routes } from '@angular/router';

const planDetailRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../plan-detail/pages/home-plan-detail/home-plan-detail.component'
      ).then((c) => c.HomePlanDetailComponent),
  },
];

export default planDetailRoutes;
