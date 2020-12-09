import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from '../services/application/storage.service';
import { LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed, registerWebPlugin, Capacitor } from '@capacitor/core'
import {FCM} from 'capacitor-fcm';
import {timeout} from 'rxjs/operators';
import { MessageService } from '../services/domain/message.service';
import { API_CONFIG } from '../configuration/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../services/domain/login.service';
import { TagService } from '../services/domain/tag.service';
const { PushNotifications } = Plugins;

const fcm = new FCM();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  private readonly TOPIC_NAME = 'chuck';
  items: { id: number, text: string }[] = [];

  permissao = false;



  appPages = [];
  loggedIn = false;
  dark = false;

  isPushNotificationsAvailable: boolean;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    public loginService: LoginService,    
    public TagService: TagService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private toast: ToastController
  ) {
    this.initializeApp();

    // const pushFlag = localStorage.getItem('allowPush');
    // this.allowPush = pushFlag != null ? JSON.parse(pushFlag) : false;

    // const personalFlag = localStorage.getItem('allowPersonal');
    // this.allowPersonal = personalFlag != null ? JSON.parse(personalFlag) : false;

    this.isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
      if(this.isPushNotificationsAvailable){
        this.initFCM();
      }
    
  }

  async ngOnInit() { 
    this.checkLoginStatus()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  

  checkLoginStatus() {
    let verifica = this.storage.getLocalUser()
    
    if(verifica && verifica.token){
      this.updateLoggedInStatus(true);
      return;
    }
    else{
     return this.updateLoggedInStatus(false);
    }
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
      if(this.loggedIn){
      this.atualizarInformacoes();      
      this.loadPages();
      }
      else{
        this.logout();
      }
    }, 300);
  }

  logout() {
    this.loginService.logout();
    return this.router.navigateByUrl('login');    
  }

  loadPages(){
    // const permissaoFlag = localStorage.getItem('permissaoFlag');
    // this.permissao = permissaoFlag != null ? JSON.parse(permissaoFlag) : false   
    this.appPages = [
      {
        title: 'Publicações',
        url: '/app/tabs/schedule',
        icon: 'newspaper',
        permit: true
      },
      {
        title: 'Tags',
        url: '/app/tabs/tags',
        icon: 'bookmark',
        permit: this.permissao
      },
      {
        title: 'Sobre',
        url: '/app/tabs/about',
        icon: 'information-circle',
        permit: true
      }
  
    ]
  }


  // async register() {
  //   let token2 = this.storage.getLocalUser().token
  //   let authHeader = new HttpHeaders({"Authorization": "Bearer " + token2})


  //   await Plugins.PushNotifications.register();
  //   const {token} = await fcm.getToken();
  //   const formData = new FormData();
  //   formData.append('token', token);
  //   formData.append('cpf',this.storage.getLocalUser().cpf)
  //   this.http.post(`${API_CONFIG.baseUrl}/message/register`, formData, {'headers': authHeader})
  //     .pipe(timeout(10000))
  //     .subscribe(() => this.allowPersonal = true);
  // }

  // async unregister() {
  //   let token2 = this.storage.getLocalUser().token
  //   let authHeader = new HttpHeaders({"Authorization": "Bearer " + token2})


  //   await Plugins.PushNotifications.register();
  //   const {token} = await fcm.getToken();
  //   const formData = new FormData();
  //   formData.append('token', token);
  //   formData.append('cpf',this.storage.getLocalUser().cpf)
  //   this.http.post(`${API_CONFIG.baseUrl}/message/unregister`, formData, {'headers': authHeader})
  //     .pipe(timeout(10000))
  //     .subscribe(() => this.allowPersonal = false);
  // }

  // onChange() {
  //   localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

  //   if (this.allowPush) {
  //     fcm.subscribeTo({ topic: this.TOPIC_NAME});
  //   } else {
  //     fcm.unsubscribeFrom({ topic: this.TOPIC_NAME});
  //   }
  // }

  // onPmChange() {
  //   if (this.allowPersonal) {
  //     this.register();
  //   } else {
  //     this.unregister();
  //   }
  // }


  async handleNotification(data) {
    if (!data.descricao) {
      return;
    }

    const alert = await this.toast.create({
      header: data.titulo,
      message: data.descricao,      
      duration: 10000,
      cssClass: "yourCssClassName",
      buttons: [
        {
          side: 'end',
          text: 'Visualizar',
          handler: () => {
            this.router.navigateByUrl(`/app/tabs/schedule/publicacao/${data.id}`)
          }
        }
      ]
      
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  private async initFCM() {
    await PushNotifications.register();

    PushNotifications.addListener('registrationError',
      error => console.log('Error on registration: ' + JSON.stringify(error)));

    // Only called when app in foreground
    PushNotifications.addListener('pushNotificationReceived',
      notification => {
        this.handleNotification(notification.data);

        Plugins.LocalNotifications.schedule({
          notifications: [{
            title: notification.title,
            body: notification.body,
            id: Date.now(),
            extra: notification.data,
            smallIcon: 'res://ic_stat_name'
          }]
        });
      }
    );

    // called when app in background and user taps on notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (event: PushNotificationActionPerformed) => {
        this.handleNotification(event.notification.data);
      }
    );

    // called when app in foreground and user taps on local notification
    Plugins.LocalNotifications.addListener('localNotificationActionPerformed',
      (event: LocalNotificationActionPerformed) => {
        this.handleNotification(event.notification.extra);
      });

  }

  atualizarInformacoes(){
    this.TagService.permissao().subscribe((data: any) => {
      this.permissao = data             
    })
    if(this.isPushNotificationsAvailable){
      this.atualizarToken();
    }
  }


  async atualizarToken() {
    const {token} = await fcm.getToken();
    const formData = new FormData();
    formData.append('token', token);
    formData.append('cpf',this.storage.getLocalUser().cpf)
    this.http.post(`${API_CONFIG.baseUrl}/message/atualizaToken`, formData)
      .pipe(timeout(10000))
      .subscribe();
  }
}
