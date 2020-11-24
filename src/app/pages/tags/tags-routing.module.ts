import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Tags } from './tags';

const routes: Routes = [
  {
    path: '',
    component: Tags
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
