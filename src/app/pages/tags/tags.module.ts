import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Tags } from './tags';
import { TagsRoutingModule } from './tags-routing.module';
import { CreateTagPage } from '../create-tag/create-tag';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsRoutingModule
  ],
  declarations: [Tags],
  entryComponents: [
    Tags
  ]
})
export class TagsModule {}
