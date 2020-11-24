import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserOptions } from '../../interfaces/user-options';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../../../services/domain/login.service';
import { TagService } from '../../../services/domain/tag.service';
import { AppComponent } from '../../app.component';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UsuarioDTO = {cpf: '', dataNascimento: null, senha: ''}
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
    public app: AppComponent
  ) { }

  async onLogin(form: NgForm) {
    this.mensagem = null;
    this.submitted = true;

    this.loading = await this.loadingCtrl.create({
      message: 'Entrando...'
    });
    await this.loading.present();

    if (form.valid) {
      this.login.cpf = this.eraseFormat(this.login.cpf)
      

       setTimeout(()=>{
        this.LoginService.login(this.login).subscribe(
          response => {
            if(response)
            console.log(response)
            this.LoginService.loginSucesso(response.headers.get('Authorization'));            
            this.app.checkLoginStatus();
            this.router.navigateByUrl('/app/tabs/schedule');
            this.loading.dismiss()
          },
          (error) => {
            if(error instanceof HttpErrorResponse) {
               console.log("Status: "+ error.status +", Message: " + error.message)
               this.mensagem = "Status: "+ error.status +", StatusText: " + error.statusText +", Name: " + error.name+", type: " + error.type+", Message: " + error.message;
            }
            this.loading.dismiss()
          }
         )
        }, 5000);
  
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

  // async onSignup() {
  //   let mensagem = null;
  //    this.LoginService.login(this.login).subscribe(
  //     response => {
  //       this.LoginService.loginSucesso(response.headers.get('Authorization'));
  //       this.router.navigateByUrl('/app/tabs/schedule');
  //     },
  //     error =>
  //     {
  //       mensagem = error.error;
  //     }
  //    )

  //    if(mensagem != null){
  //     const toast = await this.toastController.create({
  //       message: mensagem,
  //       duration: 2000
  //     });
  //    }
      
    
  //    this.router.navigateByUrl('/signup');
  // }

  ionViewDidEnter(){
    // console.log("Aqui")
    // this.LoginService.refreshToken().subscribe(
    //   response => {
    //     console.log(response)
    //     this.LoginService.loginSucesso(response.headers.get('Authorization'));
    //     this.router.navigateByUrl('/app/tabs/schedule');
    //   }
    // )
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

}
