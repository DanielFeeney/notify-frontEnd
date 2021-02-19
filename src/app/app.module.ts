import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { TagService } from '../services/domain/tag.service';
import { PublicacaoService } from '../services/domain/publicacao.service';
import { FavoritosService } from '../services/domain/favoritos.service';
import { PermissaoService } from '../services/domain/permissao.service';
import { StorageService } from '../services/application/storage.service';
import { AuthInterceptorProvider } from '../Interceptors/auth.interceptor';
import { ErrorInterceptorProvider } from '../Interceptors/error.interceptor';
import { MessageService } from '../services/domain/message.service';
import { HTTP } from '@ionic-native/http/ngx';
import { PhotoService } from '../services/application/photo.service';
import { FiltrosService } from '../services/domain/filtros.service';
import { LoginService } from '../services/domain/login.service';
import { UsuarioService } from '../services/domain/usuario.service';
import { PerfilService } from '../services/domain/perfil.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [AppComponent],
  providers: [
  InAppBrowser, SplashScreen, StatusBar,
  TagService, PublicacaoService, MessageService,
  StorageService,
  FavoritosService, PhotoService,
  HTTP,
  PermissaoService, FiltrosService, LoginService,
  UsuarioService, PerfilService,
  AuthInterceptorProvider, ErrorInterceptorProvider
],
  bootstrap: [AppComponent]
})
export class AppModule {}
