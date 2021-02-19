import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
import { StorageService } from '../../../services/application/storage.service';
import { FiltrosService } from '../../../services/domain/filtros.service';
import { TagDTO } from '../../../models/tag.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins, Capacitor } from '@capacitor/core'
import { FCM } from 'capacitor-fcm';
import { timeout } from 'rxjs/operators';
import { API_CONFIG } from '../../../configuration/api.config';
const { PushNotifications } = Plugins;


const fcm = new FCM();

@Component({
  selector: 'filtros',
  templateUrl: 'filtros.html'
})
export class Filtros implements OnInit {

  android: boolean;
  queryText = '';
  showSearchbar: boolean;
  filtrosAux : any[] = []
  cpf : string;
  veririficaMsg = true;
  msg: boolean;
  

  filtros: TagDTO[]

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    public FiltrosService: FiltrosService,
    private http: HttpClient,
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
    let isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
      if(isPushNotificationsAvailable){
        this.veririficaMsg = false;
      }
    this.buscarFiltros();
    this.validarEnviarMsg();
  }

  

  buscarFiltros() {    
      this.FiltrosService.findAll().subscribe((data: any) => {
        console.log(data)
        this.filtros = data;
        this.filtrosAux = data;
      })
    
  }

  validarEnviarMsg() {    
    this.FiltrosService.validarEnviarMsg().subscribe((data: any) => {
      this.msg = data;
    })
  
}

  search(){
    let p = []
    this.filtros = this.filtrosAux;
    this.filtros.forEach(
      (x : TagDTO) =>{
        if(x.descricao.toUpperCase().includes(this.queryText.toUpperCase())){
          p.push(x);
        }
      }
    )
    this.filtros = p;
  }

  salvar() {
    this.FiltrosService.save(this.filtros).subscribe((filtros: any[]) => {
      this.buscarFiltros()
    });
  }

  async register() {
    await Plugins.PushNotifications.register();
    const {token} = await fcm.getToken();
    const formData = new FormData();
    formData.append('token', token);
    formData.append('cpf',this.cpf)
    this.http.post(`${API_CONFIG.baseUrl}/message/register`, formData)
      .pipe(timeout(10000))
      .subscribe(() => this.msg = true);
  }

  async unregister() {
    await Plugins.PushNotifications.register();
    const {token} = await fcm.getToken();
    const formData = new FormData();
    formData.append('token', token);
    formData.append('cpf',this.cpf)
    this.http.post(`${API_CONFIG.baseUrl}/message/unregister`, formData)
      .pipe(timeout(10000))
      .subscribe(() => this.msg = false);
  }

  // onChange() {
  //   localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

  //   if (this.allowPush) {
  //     fcm.subscribeTo({ topic: this.TOPIC_NAME});
  //   } else {
  //     fcm.unsubscribeFrom({ topic: this.TOPIC_NAME});
  //   }
  // }

  onPmChange() {
    if (this.msg) {
      this.register();
    } else {
      this.unregister();
    }
  }
}
