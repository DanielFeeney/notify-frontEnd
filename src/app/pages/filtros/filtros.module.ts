import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Filtros } from './filtros';
import { FiltrosRoutingModule } from './filtros-routing.module';
import { CreateTagPage } from '../create-tag/create-tag';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrosRoutingModule
  ],
  declarations: [Filtros],
  entryComponents: [
    Filtros
  ]
})
export class FiltrosModule {}
