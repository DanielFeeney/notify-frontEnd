import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ResetPasswordPage } from './reset-password';
import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ResetPasswordPageRoutingModule
  ],
  declarations: [
    ResetPasswordPage,
  ]
})
export class ResetPasswordModule { }