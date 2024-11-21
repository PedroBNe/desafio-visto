import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

export const routes: Routes = [
  { path: 'produtos', component: ProductListComponent },
  { path: 'produtos/new', component: ProductFormComponent },
  { path: 'produtos/:id', component: ProductFormComponent },
  { path: '', redirectTo: '/produtos', pathMatch: 'full' },
];
