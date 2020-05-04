import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { UsuarioService } from '../services/domain/usuario.service';
import { StorageService } from '../services/application/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Publicações',
      url: '/app/tabs/schedule',
      icon: 'newspaper'
    },
    // {
    //   title: 'Speakers',
    //   url: '/app/tabs/speakers',
    //   icon: 'people'
    // },
    // {
    //   title: 'Map',
    //   url: '/app/tabs/map',
    //   icon: 'map'
    // },
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
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    public usuarioService: UsuarioService,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    // this.listenForLoginEvents();

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

  // listenForLoginEvents() {
  //   window.addEventListener('user:login', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:signup', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:logout', () => {
  //     this.updateLoggedInStatus(false);
  //   });
  // }

  logout() {
    this.usuarioService.logout();
    return this.router.navigateByUrl('');
    
  }
}
