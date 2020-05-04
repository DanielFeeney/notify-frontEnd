import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UsuarioDTO = {cpf: '', dataNascimento: null, senha: ''}
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    public UsuarioService: UsuarioService
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.UsuarioService.login(this.login).subscribe(
        response => {
          console.log(response)
          this.UsuarioService.loginSucesso(response.headers.get('Authorization'));
          this.router.navigateByUrl('/app/tabs/schedule');
        }
      )
      
    }
  }

  onSignup() {
    this.UsuarioService.login(this.login).subscribe(
      response => {
        this.UsuarioService.loginSucesso(response.headers.get('Authorization'));
      }
    )
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
