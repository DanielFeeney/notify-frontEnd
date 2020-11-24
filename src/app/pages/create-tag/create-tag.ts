import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagDTO } from '../../../models/tag.dto';
import { StorageService } from '../../../services/application/storage.service';
import { AlertController, ModalController, IonRouterOutlet, ToastController, NavController, LoadingController } from '@ionic/angular';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { TagService } from '../../../services/domain/tag.service';

@Component({
  selector: 'page-create-tag',
  templateUrl: 'create-tag.html'
})
export class CreateTagPage {
  default = '';
  tagId = ''
  cpf : string;

  loading: HTMLIonLoadingElement

  tag: TagDTO = {id: '', descricao: '', selecionado: false, cpfUsuario: ''};

  constructor(
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private UsuarioService: UsuarioService,
    private storage: StorageService,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    private TagService: TagService,
    private toastController: ToastController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) { }

  ionViewWillEnter() {
    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }
    this.tagId = this.route.snapshot.paramMap.get('tagId');
    if(this.tagId){
      this.TagService.find(+this.tagId).subscribe((data: TagDTO) =>{
        this.tag = data;
      });
    }
  }

  ionViewDidEnter() {
    this.default = `/app/tabs/tags`;
  }

  async toggleDelete() {
      
      const alert = await this.alertCtrl.create({
        header: "Deletar a tag",
        message: 'Você gostaria de deletar essa tag?',
        buttons: [
          {
            text: 'Cancelar',
            
          },
          {
            text: 'Deletar',
            handler: async () =>{
            let navTransition = alert.dismiss();
            this.loading = await this.loadingCtrl.create({
              message: 'Excluindo...'
            });
            this.loading.present();
            this.TagService.delete(+this.tagId).subscribe(res => {
              setTimeout(()=>{
                this.loading.dismiss();
                navTransition.then(() => {
                  this.router.navigateByUrl('/app/tabs/tags')
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

    

    async save(){
      

      
      if(this.tag.descricao.length === 0){
        const toast = await this.toastController.create({
          message: 'A tag não pode estar em branco.',
          duration: 2000
        });
        toast.present();
        return;
      }
  
      this.loading = await this.loadingCtrl.create({
        message: 'Salvando...'
      });
      await this.loading.present();

      
      
      this.TagService.save(this.tag).subscribe(res => {
        setTimeout(()=>{
          this.loading.dismiss()
          
          this.navCtrl.back()
        }, 5000);
        
      });

      
      
    }
}
