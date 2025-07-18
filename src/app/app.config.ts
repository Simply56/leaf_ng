import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApiDiscoveryService } from './api-discovery-service';
import { MockApiDiscoveryService } from './mock-api-discovery-service';
import { environment } from './environments/environments';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withFetch()),
        {
            provide: ApiDiscoveryService,
            useClass: environment.useMockServices ? MockApiDiscoveryService : ApiDiscoveryService
        }
    ],
};
