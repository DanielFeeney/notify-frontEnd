import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreatePublicacao } from './createPublicacao';
import { CreatePublicacaoRoutingModule } from './createPublicacao-routing.module';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePublicacaoRoutingModule
  ],
  providers: [
    Camera
  ],
  declarations: [CreatePublicacao],
  bootstrap: [CreatePublicacao],
})
export class CreatePublicacaoModule {}
