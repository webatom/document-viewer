import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'documents/:id',
    loadComponent: () =>
      import('./pages/document/document-page').then((m) => m.DocumentPageComponent),
  },
  {
    path: '**',
    redirectTo: '/documents/1',
  },
];
