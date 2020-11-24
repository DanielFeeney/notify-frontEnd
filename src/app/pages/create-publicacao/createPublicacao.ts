import { PopoverController, ToastController, ModalController, NavParams, Config, LoadingController } from '@ionic/angular';
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
import { Component, ElementRef, ViewChild, OnInit, SecurityContext } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
const { Camera } = Plugins;

@Component({
  selector: 'create-publicacao',
  templateUrl: 'createPublicacao.html',
})
export class CreatePublicacao {
  titulo = "Nova publicação"
  publicacao: PublicacaoDTO;
  cameraOn: boolean = false;

  ios: boolean;

  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  imagem: string;
  loading: HTMLIonLoadingElement

  

  constructor(public popoverCtrl: PopoverController,
    private TagService: TagService,
    private storage: StorageService,
    public modalCtrl: ModalController,
    private config: Config,
    public router: Router,
    private PublicacaoService: PublicacaoService,
    private toastController: ToastController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController) { 

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
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;
    }
    
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

    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...'
    });
    await this.loading.present();

    if(this.photo){
      this.imagem = this.sanitizer.sanitize(SecurityContext.URL, this.photo);
      const blob = await fetch(this.imagem).then(r => r.blob());
      this.PublicacaoService.save(this.publicacao, blob).subscribe(
        () => {
          this.loading.dismiss();
          this.cancelar();
        }
      );
    }
    else{
      this.PublicacaoService.save(this.publicacao, null).subscribe(
        () => {
          this.loading.dismiss();
          this.cancelar();
        }
      );
    }    
  }

  cancelar(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  async takePhoto(){
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

  async getPicture() {

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
  }

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);

  }

}
