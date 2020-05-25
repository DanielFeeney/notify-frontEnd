import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { FavoritosService } from '../../../services/domain/favoritos.service';
import { StorageService } from '../../../services/application/storage.service';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';
import { PublicacaoDTO } from '../../../models/publicacao.dto';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  publications: any[] = [];
  publicationsAux : any[] = []
  favorites: any[] = [];
  cpf : string;
  pages : number = 0;
  publicar : Boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config,
    private storage: StorageService,
    public PublicacaoService: PublicacaoService,
    public FavoritosService: FavoritosService
  ) { }

  ngOnInit() {
    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }

    this.PublicacaoService.criacao(this.cpf).subscribe(x =>
      this.publicar = x)
    
    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  updateSchedule() {    

    if(this.segment === 'all'){
      this.PublicacaoService.findAll(this.cpf, this.pages, 10).subscribe((data: any) => {
        this.publications = data ;
        this.publicationsAux = data;
      })
    }
    else{
      this.PublicacaoService.getFavoritos(this.cpf).subscribe((data: any) => {
        this.publications = data;
        this.publicationsAux = data;
        this.pages = 0;
      })
    } 
  }

  

  async deleteFav(slidingItem: HTMLIonItemSlidingElement, idPublication: Number, title: string){
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Você gostaria de deletar essa publicação dos favoritos?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Deletar',
          handler: () => {
            // they want to remove this session from their favorites
            this.FavoritosService.delete(idPublication, this.cpf).subscribe();
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // if (!data) {
    //   this.excludeTracks = data;      
    // }
    window.location.reload();
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, idPublicacao: Number) {
    
    const verifica = <Boolean> await this.FavoritosService.find(idPublicacao, this.cpf).toPromise().then()
    console.log(verifica)
    if (verifica === true) {
      // Prompt to remove favorite
      this.deleteFav(slidingItem, idPublicacao, 'Essa publicação já esta nos favoritos');
    } 
    if(verifica === false) {
      // Add as a favorite
      this.FavoritosService.save(idPublicacao, this.cpf).subscribe();

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `Adicionado aos favoritos.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  async abrirCreatePublicacao() {
    const modal = await this.modalCtrl.create({
      component: CreatePublicacao,
      swipeToClose: true,
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
    this.PublicacaoService.findAll(this.cpf, this.pages, 10).subscribe((data: any) => {
      this.publications = data ;
    })
    setTimeout(() =>
    {
      infiniteScrool.target.complete();
    }, 1000)
  }

  doRefresh(refresher){
    this.pages = 0;
    this.publications = []
    this.updateSchedule();
    setTimeout(() =>{
      refresher.target.complete();
    }, 1000)
  }

  search(){
    let p = []
    console.log(this.publicationsAux)
    this.publications = this.publicationsAux;
    this.publications.forEach(
      (x : PublicacaoDTO) =>{
        if(x.descricao.toUpperCase().includes(this.queryText.toUpperCase()) ||
          x.subTitulo.toUpperCase().includes(this.queryText.toUpperCase()) ||
          x.titulo.toUpperCase().includes(this.queryText.toUpperCase())){
          p.push(x);
        }
      }
    )
    this.publications = p;
  }
}
