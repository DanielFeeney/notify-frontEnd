import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UsuarioService } from '../services/domain/usuario.service';
import { StorageService } from '../services/application/storage.service';
import { LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed, registerWebPlugin, Capacitor } from '@capacitor/core'
import {FCM} from 'capacitor-fcm';
import { MessageService } from '../services/domain/message.service';
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

  allowPush: boolean;
  allowPersonal: boolean;

  appPages = [
    {
      title: 'Publicações',
      url: '/app/tabs/schedule',
      icon: 'newspaper'
    },
    {
      title: 'Sobre',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }

  ];
  loggedIn = true;
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    public usuarioService: UsuarioService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private MessageService: MessageService
  ) {
    this.initializeApp();

    const pushFlag = localStorage.getItem('allowPush');
    this.allowPush = pushFlag != null ? JSON.parse(pushFlag) : false;

    const personalFlag = localStorage.getItem('allowPersonal');
    this.allowPersonal = personalFlag != null ? JSON.parse(personalFlag) : false;

    let isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
      if(isPushNotificationsAvailable){
        this.initFCM().then(() => {
          this.onChange();
          this.onPmChange();
        });
      }

    
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });
      await toast.present();
      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  

  checkLoginStatus() {
    let verifica = this.storage.getLocalUser()
    
    if(!verifica.token){
      return this.updateLoggedInStatus(false);
    }
    else{
     return this.updateLoggedInStatus(true);
    }
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  logout() {
    this.usuarioService.logout();
    return this.router.navigateByUrl('');    
  }

  


  async register() {
    this.allowPersonal = await this.MessageService.register(fcm, this.allowPersonal);
  }

  async unregister() {
    this.allowPersonal = await this.MessageService.unregister(fcm, this.allowPersonal)
  }

  onChange() {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      fcm.subscribeTo({ topic: this.TOPIC_NAME});
    } else {
      fcm.unsubscribeFrom({ topic: this.TOPIC_NAME});
    }
  }

  onPmChange() {
    localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal));

    if (this.allowPersonal) {
      this.register();
    } else {
      this.unregister();
    }
  }


  handleNotification(data) {
    if (!data.text) {
      return;
    }

    this.items.splice(0, 0, {id: data.id, text: data.text});

    // only keep the last 5 entries
    if (this.items.length > 5) {
      this.items.pop();
    }

    this.changeDetectorRef.detectChanges();
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
}
