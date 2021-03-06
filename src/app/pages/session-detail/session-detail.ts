import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagDTO } from '../../../models/tag.dto';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { FavoritosService } from '../../../services/domain/favoritos.service';
import { StorageService } from '../../../services/application/storage.service';
import { AlertController, ModalController, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { PermissaoService } from '../../../services/domain/permissao.service';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { CreatePublicacao } from '../create-publicacao/createPublicacao';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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


  voltar = '';
  idPublicacao = ''
  cpf : string;

  filtros: TagDTO[] = [];
  publicacao: PublicacaoDTO;

  imageurl: SafeResourceUrl;

  loading: HTMLIonLoadingElement

  constructor(
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private PermissaoService: PermissaoService,
    private storage: StorageService,
    public router: Router,    
    public loadingCtrl: LoadingController,
    public routerOutlet: IonRouterOutlet,
    public PublicacaoService: PublicacaoService,
    private FavoritosService: FavoritosService,
    private sanitizer: DomSanitizer
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

    this.PublicacaoService.getImage(+this.idPublicacao).subscribe((res) =>{
      if(res.byteLength > 0){
        let TYPED_ARRAY = new Uint8Array(res);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');
        let base64String = btoa(STRING_CHAR);
        this.imageurl = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,${base64String}`);
      }
      else{
        this.imageurl = null;
      }
    });

     this.FavoritosService.find(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>
        this.isFavorite = data
     );

     this.PermissaoService.edicao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
       this.editar = data;
     });

     this.PermissaoService.delecao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
       this.excluir = data;
    });
  }

  ionViewDidEnter() {
    this.voltar = `/app/tabs/schedule`;
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
            handler: async () => {
              let navTransition = alert.dismiss();
              this.loading = await this.loadingCtrl.create({
              message: 'Excluindo...'
              });
              this.loading.present();
              this.PublicacaoService.delete(+this.idPublicacao).subscribe(res =>{
                setTimeout(()=>{
                  this.loading.dismiss();
                  navTransition.then(() => {                    
                  this.router.navigateByUrl('/app/tabs/schedule')
                  });
                }, 5000);  
              })
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
        titulo: "Editar publicação",
        publicacao: this.publicacao,
        photo: this.imageurl
      },
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    

    let loading: HTMLIonLoadingElement
    
    loading = await this.loadingCtrl.create({
      message: "Carregando..."
    });
    await loading.present();

    this.PublicacaoService.getImage(+this.idPublicacao).subscribe((res) =>{
      if(res.byteLength > 0){
        let TYPED_ARRAY = new Uint8Array(res);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');
        let base64String = btoa(STRING_CHAR);
        this.imageurl = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,${base64String}`);
      }
      else{
        this.imageurl = null;
      }
    });

    this.PublicacaoService.find(+this.idPublicacao).subscribe((data: PublicacaoDTO) =>{
      this.publicacao = data;
      this.filtros = data.colTagDTO;
      loading.dismiss()
    });
  }
}
