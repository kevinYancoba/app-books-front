import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor } from './core/interceptors';
import {
  AppInitializerService,
  appInitializerFactory,
} from './core/services/app-initializer.service';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitializerService],
      multi: true,
    },
  ],
};
