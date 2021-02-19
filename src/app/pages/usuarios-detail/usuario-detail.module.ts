import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioDetailPage } from './usuario-detail';
import { UsuarioDetailPageRoutingModule } from './usuario-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UsuarioDetailPageRoutingModule
  ],
  declarations: [
    UsuarioDetailPage,
  ]
})
export class UsuarioDetailModule { }
