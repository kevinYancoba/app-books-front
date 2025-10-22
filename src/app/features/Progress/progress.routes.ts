import { Routes } from '@angular/router';

const progressRoutes: Routes = [
  {
    path: 'report',
    loadComponent: () =>
      import('./pages/progress-report/progress-report.component').then(
        (c) => c.ProgressReportComponent
      ),
  },
];

export default progressRoutes;
