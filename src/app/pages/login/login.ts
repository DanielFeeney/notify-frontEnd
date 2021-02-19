import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserOptions } from '../../interfaces/user-options';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../../services/domain/login.service';
import { TagService } from '../../../services/domain/tag.service';
import { AppComponent } from '../../app.component';
import { LoginDTO } from '../../../models/login.dto';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: LoginDTO = {cpf: '', dataNascimento: null, senha: ''}
  submitted = false;
  mensagem : string;


  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  loading: HTMLIonLoadingElement

  constructor(
    public router: Router,
    public LoginService: LoginService,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    public app: AppComponent,
    public alertCtrl: AlertController
  ) { }

  async onLogin(form: NgForm) {
    this.mensagem = null;
    this.submitted = true;

    this.load('Carregando...');

    if (form.valid) {
      this.login.cpf = this.eraseFormat(this.login.cpf)
      

       setTimeout(()=>{
        this.LoginService.login(this.login).subscribe(
          response => {
            if(response)
            this.LoginService.loginSucesso(response.headers.get('Authorization'));            
            this.app.checkLoginStatus();
            this.router.navigateByUrl('/app/tabs/schedule');
            this.loading.dismiss()
          },
          (error) => {
            if(error instanceof HttpErrorResponse) {
               this.ErroLogin()
            }
            this.loading.dismiss()
          }
         )
        }, 5000);
  
       if(this.mensagem != null){
        const toast = await this.toastController.create({
          message: this.mensagem,
          duration: 2000
        });
        await toast.present()
       }
      }
    }

  ionViewDidEnter(){    
    this.LoginService.refreshToken().subscribe(
      response => {
        this.LoginService.loginSucesso(response.headers.get('Authorization'));
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    )
  }

  async load(texto : string){
    this.loading = await this.loadingCtrl.create({
      message: texto
    });
    await this.loading.present();
  }

  format() {
    if (!this.login.cpf) {
        return '';
    }
    let val = this.login.cpf.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    this.pureResult = parts;  
    this.maskedId = this.cpf_mask(parts[0]);
    this.login.cpf = this.maskedId;
    
};

cpf_mask(v) {
  v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
  v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
  v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
  //de novo (para o segundo bloco de números)
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
  return v;
}

unFormat(val) {
  if (!val) {
      return '';
  }
  val = val.replace(/\D/g, '');

  if (this.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
  } else {
      return val.replace(/\./g, '');
  }
};

eraseFormat(v: string){
  v = v.replace('.', ''); 
  v = v.replace('.', ''); 
  v = v.replace('-', '');
  return v;
}

signUp(){
  this.router.navigateByUrl('login/registrar');
}

resetPassword(){
  this.router.navigateByUrl('login/reset-password');
}

async ErroLogin(){
  let alert = await this.alertCtrl.create({
      header: 'Não é possivel entrar',
      message: "Efetue o cadastro ou tente novamente",
      buttons: [
          {
              text: 'Ok'
          }
      ]
  });
  alert.present(); 
}

}
