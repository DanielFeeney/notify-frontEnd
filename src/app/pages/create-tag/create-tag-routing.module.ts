import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateTagPage } from './create-tag';

const routes: Routes = [
  {
    path: '',
    component: CreateTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTagPageRoutingModule { }
