import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { Plugins, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
const { Camera } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfilePage implements OnInit {

  usuario: UsuarioDTO
  photo: SafeResourceUrl;
  cpf: string;

  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public UsuarioService: UsuarioService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.UsuarioService.buscarPerfil().subscribe((data: UsuarioDTO) =>{
      this.usuario = data;
      this.FormatarCpf(this.usuario.cpf);
    });
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

  FormatarCpf(texto: string){
    this.cpf = texto.substring(0, 3) + "." + texto.substring(3,6) + "." + texto.substring(6, 9) + "-" + texto.substring(9,11)
  }

}
