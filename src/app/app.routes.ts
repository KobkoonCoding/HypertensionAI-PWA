import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'input',
    loadComponent: () =>
      import('./input/input.page').then((m) => m.InputPage),
  },
  {
    path: 'care',
    loadComponent: () =>
      import('./care/care.page').then((m) => m.CarePage),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'result',
    loadComponent: () => import('./result/result.page').then( m => m.ResultPage)
  },
];
