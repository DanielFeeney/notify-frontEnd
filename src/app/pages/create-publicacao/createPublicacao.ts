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
import {storage, initializeApp} from 'firebase'
import { firebaseConfig } from '../../../services/application/firebase.configutation';

@Component({
  selector: 'create-publicacao',
  templateUrl: 'createPublicacao.html',
})
export class CreatePublicacao {
  photo = this.photoService.photo;
  publicacao: PublicacaoDTO;
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
    private toastController: ToastController) { 

      initializeApp(firebaseConfig);

    }

  ionViewWillEnter() {
    let verifica = this.storage.getLocalUser();
    let cpf: string
    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      cpf = verifica.cpf;
    }
    if(this.publicacao == null){
      this.publicacao =  {id: null, titulo : '', subTitulo: '', descricao: '', dataCriacao: new Date(), imagem: '', colTagDTO: [], cpfUsuario: null}
      this.TagService.allTags().subscribe((filtros: any[]) => {
        this.publicacao.colTagDTO = filtros;
      });      
    }
    else{
      this.TagService.findAllByPublicacao(+this.publicacao.id).subscribe((filtros: any[]) => {
        this.publicacao.colTagDTO = filtros;
      });
    }
    this.publicacao.cpfUsuario = cpf;
    this.ios = this.config.get('mode') === `ios`;

    
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
    this.publicacao.colTagDTO.forEach(tag => {
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
    
    this.photoService.addNewToGallery()
  }

}
