import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AboutModule } from '../about/about.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { SessionDetailModule } from '../session-detail/session-detail.module';
import { TagsModule } from '../tags/tags.module';
import { CreateTagModule } from '../create-tag/create-tag.module';
import { FiltrosModule } from '../filtros/filtros.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { UsuarioDetailModule } from '../usuarios-detail/usuario-detail.module';

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    ScheduleModule,
    SessionDetailModule,
    TabsPageRoutingModule,
    TagsModule,
    CreateTagModule,
    FiltrosModule,
    UsuariosModule,
    UsuarioDetailModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
