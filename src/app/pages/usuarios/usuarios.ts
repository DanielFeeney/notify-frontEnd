import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
import { StorageService } from '../../../services/application/storage.service';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { PermissaoService } from '../../../services/domain/permissao.service';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { UsuarioService } from '../../../services/domain/usuario.service';

@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
  styleUrls: ['./usuarios.scss'],
})
export class UsuariosPage implements OnInit {
  
  ios: boolean;
  queryText = '';
  showSearchbar: boolean;
  usersAux : any[] = []
  favorites: any[] = [];
  cpf : string;
  pages : number = 0;

  users: UsuarioDTO[]

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public config: Config,
    private storage: StorageService,
    public UsuarioService: UsuarioService
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
      this.UsuarioService.allUsers().subscribe((data: any) => {
        this.users = data;
        this.usersAux = data;
      })
    
  }

  doInfinite(infiniteScrool){
    this.pages += 10;
    this.UsuarioService.allUsers().subscribe((data: any) => {
      this.users = data ;
    })
    setTimeout(() =>
    {
      infiniteScrool.target.complete();
    }, 1000)
  }

  doRefresh(refresher){
    this.pages = 0;
    this.users = []
    this.updateSchedule();
    setTimeout(() =>{
      refresher.target.complete();
    }, 1000)
  }

  search(){
    let p = []
    this.users = this.usersAux;
    this.users.forEach(
      (x : UsuarioDTO) =>{
        if(x.nome.toUpperCase().includes(this.queryText.toUpperCase()) ||
          x.perfil.toUpperCase().includes(this.queryText.toUpperCase()) ||
          x.email.toUpperCase().includes(this.queryText.toUpperCase())){
          p.push(x);
        }
      }
    )
    this.users = p;
  }
}
