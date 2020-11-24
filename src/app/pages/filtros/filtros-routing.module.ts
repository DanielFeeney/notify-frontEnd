import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Filtros } from './filtros';

const routes: Routes = [
  {
    path: '',
    component: Filtros
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiltrosRoutingModule { }
