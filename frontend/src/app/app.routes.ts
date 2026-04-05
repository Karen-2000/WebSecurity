import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/loginPage/loginPage.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      )
  }
];
