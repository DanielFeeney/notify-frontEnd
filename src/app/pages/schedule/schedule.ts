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
  favorites: any[] = [];
  cpf : string;
  pages : number = 0;

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
    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    

    if(this.segment === 'all'){
      this.PublicacaoService.findAll(this.cpf, this.pages, 10).subscribe((data: any) => {
        this.publications = this.publications.concat(data) ;
      })
    }
    else{
      this.PublicacaoService.getFavoritos(this.cpf).subscribe((data: any) => {
        this.favorites = data;
        this.publications = []
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
    this.updateSchedule();
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
}
