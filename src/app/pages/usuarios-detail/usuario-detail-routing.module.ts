import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuarioDetailPage } from './usuario-detail';

const routes: Routes = [
  {
    path: '',
    component: UsuarioDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioDetailPageRoutingModule { }
