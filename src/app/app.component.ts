import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import {storage, initializeApp, app, apps} from 'firebase'
import { firebaseConfig } from '../services/application/firebase.configutation';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from '../services/application/storage.service';
import { LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed, registerWebPlugin, Capacitor } from '@capacitor/core'
import {FCM} from 'capacitor-fcm';
import { LoginService } from '../services/domain/login.service';
import { TagService } from '../services/domain/tag.service';
import { PermissaoService } from '../services/domain/permissao.service';
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

  permissaoTagUsuario = false;

  permissaoUsuario = false;


  appPages = [];
  loggedIn = false;
  dark = false;

  isPushNotificationsAvailable: boolean;

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    public loginService: LoginService,
    public TagService: TagService,
    public PermissaoService: PermissaoService,
    private toast: ToastController
  ) {
    this.initialize();

    if (!apps.length) {
      initializeApp(firebaseConfig);
    }else {
      app(); // if already initialized, use that one
    }


    this.isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
      if(this.isPushNotificationsAvailable){
        this.initFCM();
      }
    
  }

  async ngOnInit() {
    this.checkLoginStatus()
  }

  initialize() {
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
        permit: this.permissaoTagUsuario
      },
      {
        title: 'Usuarios',
        url: '/app/tabs/user',
        icon: 'people',
        permit: this.permissaoTagUsuario
      },
      {
        title: 'Sobre',
        url: '/app/tabs/about',
        icon: 'information-circle',
        permit: true
      }
  
    ]
  }


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
    this.atualizarPermissoes()
    if(this.isPushNotificationsAvailable){
      this.atualizarToken();
    }
    this.atualizarFiltros();
  }

  atualizarPermissoes(){
    this.permissaoMenuTag()
  }

  permissaoMenuTag(){
    let cpf = this.storage.getLocalUser().cpf
    this.PermissaoService.tagUsuario(cpf).subscribe((data: any) => {
      this.permissaoTagUsuario = data
      this.permissaoMenuUsuario();
    })
  }

  permissaoMenuUsuario(){
    this.loadPages();
  }


  async atualizarToken() {
    let cpf = this.storage.getLocalUser().cpf
    const {token} = await fcm.getToken();
    this.PermissaoService.atualizarToken(token, cpf).subscribe();
  }

  atualizarFiltros(){
    this.TagService.allTags().subscribe((filtros: any[]) => {
      localStorage.setItem('filtros', JSON.stringify(filtros));
    });
  }
}
