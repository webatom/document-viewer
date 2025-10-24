import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideMockDocumentsApi } from './shared';
import { provideMockAnnotationsApi } from './shared/api/annotations/mock-annotations-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideMockDocumentsApi(),
    provideMockAnnotationsApi(),
  ],
};
