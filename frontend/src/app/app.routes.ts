import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      )
  }
];
