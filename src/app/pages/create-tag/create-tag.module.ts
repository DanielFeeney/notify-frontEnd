import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTagPage } from './create-tag';
import { CreateTagPageRoutingModule } from './create-tag-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTagPageRoutingModule
  ],
  declarations: [
    CreateTagPage,
  ]
})
export class CreateTagModule { }
