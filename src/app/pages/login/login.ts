import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UsuarioDTO = {cpf: '', dataNascimento: null, senha: ''}
  submitted = false;
  mensagem : string;

  constructor(
    public userData: UserData,
    public router: Router,
    public UsuarioService: UsuarioService,
    public toastController: ToastController
  ) { }

  async onLogin(form: NgForm) {
    this.mensagem = null;
    this.submitted = true;

    if (form.valid) {
      this.UsuarioService.login(this.login).subscribe(
        response => {
          if(response)
          console.log(response)
          this.UsuarioService.loginSucesso(response.headers.get('Authorization'));
          this.router.navigateByUrl('/app/tabs/schedule');
        },
        (error) => {
          if(error instanceof HttpErrorResponse) {
             console.log("Status: "+ error.status +", Message: " + error.message)
             this.mensagem = "Status: "+ error.status +", StatusText: " + error.statusText +", Name: " + error.name+", type: " + error.type+", Message: " + error.message;
          }
        }
       )

       setTimeout(()=>{
        }, 500000);
  
       if(this.mensagem != null){
         console.log(this.mensagem)
        const toast = await this.toastController.create({
          message: this.mensagem,
          duration: 2000
        });
        await toast.present()
       }
      }
    }

  async onSignup() {
    let mensagem = null;
     this.UsuarioService.login(this.login).subscribe(
      response => {
        this.UsuarioService.loginSucesso(response.headers.get('Authorization'));
        this.router.navigateByUrl('/app/tabs/schedule');
      },
      error =>
      {
        mensagem = error.error;
      }
     )

     if(mensagem != null){
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000
      });
     }
      
    
     this.router.navigateByUrl('/signup');
  }

  ionViewDidEnter(){
    this.UsuarioService.refreshToken().subscribe(
      response => {
        console.log(response)
        this.UsuarioService.loginSucesso(response.headers.get('Authorization'));
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    )
  }
}
