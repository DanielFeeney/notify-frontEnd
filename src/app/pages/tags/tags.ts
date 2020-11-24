import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { FavoritosService } from '../../../services/domain/favoritos.service';
import { StorageService } from '../../../services/application/storage.service';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { TagDTO } from '../../../models/tag.dto';
import { CreateTagPage } from '../create-tag/create-tag';
import { TagService } from '../../../services/domain/tag.service';

@Component({
  selector: 'tags',
  templateUrl: 'tags.html'
})
export class Tags implements OnInit {

  ios: boolean;
  queryText = '';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  tagsAux : any[] = []
  favorites: any[] = [];
  cpf : string;
  pages : number = 0;

  tags: TagDTO[]

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    private storage: StorageService,
    public TagsService: TagService
  ) { }

  ngOnInit() {
    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }

  }
  ionViewWillEnter(){
    
    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  

  updateSchedule() {    
      this.TagsService.allTags().subscribe((data: any) => {
        this.tags = data;
        this.tagsAux = data;
      })
    
  }

  async abrirCreateTag() {
    const modal = await this.modalCtrl.create({
      component: CreateTagPage,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // if (!data) {
    //   this.excludeTracks = data;      
    // }
    window.location.reload();
  }

  doInfinite(infiniteScrool){
    this.pages += 10;
    this.TagsService.allTags().subscribe((data: any) => {
      this.tags = data ;
    })
    setTimeout(() =>
    {
      infiniteScrool.target.complete();
    }, 1000)
  }

  doRefresh(refresher){
    this.pages = 0;
    this.tags = []
    this.updateSchedule();
    setTimeout(() =>{
      refresher.target.complete();
    }, 1000)
  }

  search(){
    let p = []
    this.tags = this.tagsAux;
    this.tags.forEach(
      (x : TagDTO) =>{
        if(x.descricao.toUpperCase().includes(this.queryText.toUpperCase())){
          p.push(x);
        }
      }
    )
    this.tags = p;
  }
}
