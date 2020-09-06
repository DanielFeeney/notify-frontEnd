import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagDTO } from '../../../models/tag.dto';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { FavoritosService } from '../../../services/domain/favoritos.service';
import { StorageService } from '../../../services/application/storage.service';
import { AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  editar = false;
  excluir = false;


  default = '';
  idPublicacao = ''
  cpf : string;

  filtros: TagDTO[] = [];
  publicacao: PublicacaoDTO;

  constructor(
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private UsuarioService: UsuarioService,
    private storage: StorageService,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public PublicacaoService: PublicacaoService,
    private FavoritosService: FavoritosService
  ) { }

  ionViewWillEnter() {
    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }
    this.idPublicacao = this.route.snapshot.paramMap.get('publicacaoId');
    this.PublicacaoService.find(+this.idPublicacao).subscribe((data: PublicacaoDTO) =>{
      this.publicacao = data;
      this.filtros = data.colTagDTO;
    });

     this.FavoritosService.find(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>
     this.isFavorite = data
     );

     this.UsuarioService.edicao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
       console.log(data)
       this.editar = data;
     });

     this.UsuarioService.delecao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
       this.excluir = data;
    });
  }

  ionViewDidEnter() {
    this.default = `/app/tabs/schedule`;
  }

  toggleFavorite() {
    if(this.isFavorite){
      this.isFavorite = false;
      this.FavoritosService.delete(+this.idPublicacao, this.cpf).subscribe()
    }
    else{
      this.isFavorite = true;
      this.FavoritosService.save(+this.idPublicacao, this.cpf).subscribe()
    }
  }

  async toggleDelete() {
    if(this.excluir){
      const alert = await this.alertCtrl.create({
        header: "Deletar a publicação",
        message: 'Você gostaria de deletar essa publicação?',
        buttons: [
          {
            text: 'Cancelar',
            
          },
          {
            text: 'Deletar',
            handler: () => {
              // they want to remove this session from their favorites
              this.PublicacaoService.delete(+this.idPublicacao).subscribe()
              this.router.navigateByUrl('/app/tabs/schedule')
            }
          }
        ]
      });
      // now present the alert on top of all other content
      await alert.present();
    }
  }

  async toggleEdit() {
    const modal = await this.modalCtrl.create({
      component: CreatePublicacao,
      componentProps:{
        publicacao: this.publicacao
      },
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // if (!data) {
    //   this.excludeTracks = data;      
    // }
    window.location.reload();
  }
}
