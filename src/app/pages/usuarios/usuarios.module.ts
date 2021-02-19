import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UsuariosPage } from './usuarios';
import { UsuariosPageRoutingModule } from './usuarios-routing.module';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';
import { UsuarioDetailPage } from '../usuarios-detail/usuario-detail';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule
  ],
  declarations: [
    UsuariosPage,
  ],
  entryComponents: [
  ]
})
export class UsuariosModule { }
