import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';
import { CreatePublicacaoRoutingModule } from '../create-publicacao/createPublicacao-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage,
    CreatePublicacao
  ],
  entryComponents: [
    ScheduleFilterPage,
    CreatePublicacao
  ]
})
export class ScheduleModule { }
