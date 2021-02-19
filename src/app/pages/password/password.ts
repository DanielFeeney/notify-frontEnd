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
  selector: 'app-password',
  templateUrl: './password.html',
  styleUrls: ['./password.scss'],
})
export class PasswordPage implements OnInit {

  formGroup: FormGroup;

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
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required],
    },
    {
      validator: this.checkPasswords('senha', 'confirmarSenha')
    }
    )
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

  save(){
    this.UsuarioService.mudarSenha(this.formGroup.controls['senha'].value).subscribe((data)=>{
      this.showOkMessage()
    })
  }

  async showOkMessage(){
    let alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Nova senha cadastrada com sucesso',
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


}
