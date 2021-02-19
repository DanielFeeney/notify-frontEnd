import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { Plugins, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/application/storage.service';
const { Camera } = Plugins;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordPage implements OnInit {

  formGroup: FormGroup;

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  constructor(
    private router: Router,
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public UsuarioService: UsuarioService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento:['', Validators.required]
    }
    )
  }

  save(){
    let usuario = this.formGroup.value;
    usuario.cpf = this.eraseFormat(usuario.cpf)
    this.UsuarioService.resetarSenha(usuario).subscribe((data)=>{
      this.showOkMessage()
    })
  }

  async showOkMessage(){
    let alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Senha resetada com sucesso! Nova Senha: 123456',
      buttons: [
        {
          text: 'Ok',
          handler: () => {            
            this.storage.setLocalUser(null); 
            this.router.navigateByUrl('login');
          }
        }
      ]
    });
    alert.present();
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
