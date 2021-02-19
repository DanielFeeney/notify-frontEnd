import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { PerfilDTO } from '../../../models/perfil.dto';
import { PerfilService } from '../../../services/domain/perfil.service';
import { UsuarioService } from '../../../services/domain/usuario.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class SignUpPage implements OnInit {

  formGroup: FormGroup;

  perfis: PerfilDTO[]

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  constructor(
    public navCtrl: NavController,
    private router: Router,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private PerfilService: PerfilService,
    private UsuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      cpf: ['',[Validators.required, Validators.maxLength(14)]],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      perfilId: ['', Validators.required],
    },
    {
      validator: this.checkPasswords('senha', 'confirmarSenha')
    }
    )

    this.PerfilService.findAllSignIn().subscribe((data: PerfilDTO[]) =>{
      this.perfis = data;
    })
  }

  checkPasswords(controlName: string, matchingControlName: string) { // here we have the 'passwords' group
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }    
  }

  async signUpUser(){
    let usuario = this.formGroup.value;
    usuario.cpf = this.eraseFormat(usuario.cpf)
    this.UsuarioService.save(usuario).subscribe(res => {
      setTimeout(()=>{
        this.showOkMessage();
      }, 5000);
      
    });
   
  }

  async showOkMessage(){
    let alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
    
    this.router.navigateByUrl('login');
  }

  format() {
    if (!this.formGroup.value.cpf) {
        return '';
    }
    let val = this.formGroup.value.cpf
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    this.pureResult = parts;  
    this.maskedId = this.cpf_mask(parts[0]);
    this.formGroup.patchValue(
      {cpf: this.maskedId}
    )
    
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
