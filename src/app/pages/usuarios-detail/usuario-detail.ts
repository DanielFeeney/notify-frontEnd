import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { StorageService } from '../../../services/application/storage.service';
import { AlertController, ModalController, IonRouterOutlet, ToastController, NavController, LoadingController } from '@ionic/angular';
import { PermissaoService } from '../../../services/domain/permissao.service';
import { UsuarioService } from '../../../services/domain/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilService } from '../../../services/domain/perfil.service';
import { PerfilDTO } from '../../../models/perfil.dto';

@Component({
  selector: 'page-usuario-detail',
  templateUrl: 'usuario-detail.html'
})
export class UsuarioDetailPage {
  voltar = '';
  usuarioId = ''
  cpf : string;

  proprioUsuario = false;

  showBin = false;

  loading: HTMLIonLoadingElement

  formGroup: FormGroup;

  perfis: PerfilDTO[]

  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  pureResult: any;
  maskedId: any;
  val: any;
  v: any;

  constructor(
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    private storage: StorageService,
    private permissaoService: PermissaoService,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    private UsuarioService: UsuarioService,
    private PerfilService: PerfilService, 
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
  ) { }

  ionViewWillEnter() {
    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }
    this.usuarioId = this.route.snapshot.paramMap.get('usuarioId');
    this.PerfilService.findAll().subscribe((data: PerfilDTO[]) =>{
      this.perfis = data;
    })
    if(this.usuarioId){
      this.UsuarioService.find(+this.usuarioId).subscribe((data: UsuarioDTO) =>{
        this.formGroup = this.formBuilder.group({
          id: [data.id],
          nome: [data.nome, [Validators.required, Validators.minLength(1)]],
          email: [data.email, [Validators.required, Validators.email]],
          cpf: [data.cpf, [Validators.required, Validators.maxLength(14)]],
          perfilId: [data.perfilId, Validators.required],
          dataNascimento: [data.dataNascimento, Validators.required]
        })        
      this.format()
      this.proprioUsuario = this.permissaoService.proprioUsuario(data.cpf);
      });
      this.showBin = true;
      
    }
    else{
      this.formGroup = this.formBuilder.group({
        id: [],
        nome: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        cpf: ['', [Validators.required, Validators.maxLength(14)]],
        perfilId: ['', Validators.required],
        dataNascimento: ['', Validators.required]
      })
      this.showBin = false;
    }
    
  }

  ionViewDidEnter() {
    this.voltar = `/app/tabs/user`;
  }

  async toggleDelete() {
      if(!this.proprioUsuario){
        const alert = await this.alertCtrl.create({
          header: "Deletar usuário",
          message: 'Você gostaria de deletar o usuário?',
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
              this.UsuarioService.delete(+this.usuarioId).subscribe(res => {
                setTimeout(()=>{
                  this.loading.dismiss();
                  navTransition.then(() => {
                    this.router.navigateByUrl('/app/tabs/user')
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
      else{
        const alert = await this.alertCtrl.create({
          header: "Deletar usuário",
          message: 'Ao se deletar, não será possível ter acesso por esse usuário. Prosseguir?',
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
              this.UsuarioService.delete(+this.usuarioId).subscribe(res => {
                setTimeout(()=>{
                  this.loading.dismiss();
                  navTransition.then(() => {
                    this.router.navigateByUrl('login')
                    this.storage.setLocalUser(null)
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

    

    async save(){
      let usuario = this.formGroup.value;
      usuario.cpf = this.eraseFormat(usuario.cpf)
      this.loading = await this.loadingCtrl.create({
        message: 'Salvando...'
      });
      await this.loading.present();

      this.UsuarioService.save(usuario).subscribe(res => {
        setTimeout(()=>{
          this.loading.dismiss()
          
          if(this.proprioUsuario){
            this.router.navigateByUrl('login')
            this.storage.setLocalUser(null)
          }
          else{
            this.navCtrl.back()
          }
        }, 5000);
        
      });
      
     

      
      
    }

    format() {
      if (!this.formGroup.controls['cpf'].value) {
          return '';
      }
      let val = this.formGroup.controls['cpf'].value.toString();
      const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
      this.pureResult = parts;  
      this.maskedId = this.cpf_mask(parts[0]);
      this.formGroup.patchValue(
        {cpf: this.maskedId}
      )
      
  };
  
  cpf_mask(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
  }
  
  unFormat(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/\D/g, '');
  
    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
  };
  
  eraseFormat(v: string){
    v = v.replace('.', ''); 
    v = v.replace('.', ''); 
    v = v.replace('-', '');
    return v;
  }
}
