import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/builder/builder-page/builder-page.component')
        .then(m => m.BuilderPageComponent),
    title: 'FormCraft — Form Builder',
  },
  {
    path: 'view/:data',
    loadComponent: () =>
      import('./features/form-view/form-view.component')
        .then(m => m.FormViewComponent),
    title: 'FormCraft — Submission',
  },
  { path: '**', redirectTo: '' },
];
