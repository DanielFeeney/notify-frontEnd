import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatePublicacao } from './createPublicacao';

const routes: Routes = [
  {
    path: '',
    component: CreatePublicacao
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePublicacaoRoutingModule { }
