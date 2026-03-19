import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/builder/builder-page/builder-page.component')
        .then(m => m.BuilderPageComponent),
    title: 'FormCraft — Form Builder',
  },
  { path: '**', redirectTo: '' },
];
