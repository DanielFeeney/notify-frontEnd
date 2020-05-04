import { Component } from '@angular/core';

import { PopoverController, ToastController, ModalController, NavParams, Config } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { TagDTO } from '../../../models/tag.dto';
import { TagService } from '../../../services/domain/tag.service';
import { PhotoService } from '../../../services/application/photo.service';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { StorageService } from '../../../services/application/storage.service';
import { Router } from '@angular/router';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';

@Component({
  selector: 'create-publicacao',
  templateUrl: 'createPublicacao.html',
})
export class CreatePublicacao {



  publicacao: PublicacaoDTO;
  photo: string;
  cameraOn: boolean = false;

  ios: boolean;

  

  constructor(public popoverCtrl: PopoverController,
    private TagService: TagService,
    private photoService: PhotoService,
    private storage: StorageService,
    public modalCtrl: ModalController,
    private config: Config,
    public router: Router,
    private PublicacaoService: PublicacaoService,
    private toastController: ToastController,
    public camera: Camera) { }

  ionViewWillEnter() {
    let verifica = this.storage.getLocalUser();
    let cpf: string
    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      cpf = verifica.cpf;
    }
    this.publicacao = {id: null, titulo : '', subTitulo: '', descricao: '', dataCriacao: new Date(), imagem: '', colTag: [], cpfUsuario: cpf}
    this.ios = this.config.get('mode') === `ios`;

    this.photoService.loadSaved();

    this.TagService.allTags().subscribe((filtros: any[]) => {
      console.log(filtros)
      this.publicacao.colTag = filtros;
    });
  }

  async save(){
    if(this.publicacao.titulo.length === 0){
      const toast = await this.toastController.create({
        message: 'Digite um título.',
        duration: 2000
      });
      toast.present();
      return;
    }
    if(this.publicacao.descricao.length === 0){
      const toast = await this.toastController.create({
        message: 'Digite uma descrição.',
        duration: 2000
      });
      toast.present();
      return;
    }
    let verificaSelecionado = false;
    this.publicacao.colTag.forEach(tag => {
      if(tag.selecionado){
        verificaSelecionado = true;
      }
    })
    if(!verificaSelecionado){
      const toast = await this.toastController.create({
        message: 'Selecione as tags.',
        duration: 2000
      });
      toast.present();
      return;
    }
    this.PublicacaoService.save(this.publicacao).subscribe();
    this.cancelar();
  }

  cancelar(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  getCameraPhoto(){
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.photo = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
     // Handle error
    });
  }

}
