import { Component } from '@angular/core';
import { Config, LoadingController, ModalController, NavParams } from '@ionic/angular';

import { TagService } from '../../../services/domain/tag.service';
import { TagDTO } from '../../../models/tag.dto';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/application/storage.service';
import { FiltrosService } from '../../../services/domain/filtros.service';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  filtros: TagDTO[] = [];

  cpf : string;
  loading: HTMLIonLoadingElement

  constructor(
    private config: Config,
    public modalCtrl: ModalController,
    private storage: StorageService,
    public router: Router,
    public FiltrosService: FiltrosService,
    public loadingCtrl: LoadingController
  ) { }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;

    let verifica = this.storage.getLocalUser();

    if(!verifica.token){
      this.router.navigateByUrl('')
    }
    else{
      this.cpf = verifica.cpf;
    }

    const filtros = localStorage.getItem('filtros');
    this.filtros = filtros != null ? JSON.parse(filtros) : [];
  }

  selecionarTodos(check: boolean){
    this.filtros.forEach(filtro => {
          filtro.selecionado = check;
        });
  }

  async salvar() {
    this.loading = await this.loadingCtrl.create({
      message: 'Salvando...'
    });
    await this.loading.present();

    setTimeout(() => {
      localStorage.setItem('filtros', JSON.stringify(this.filtros));
        this.loading.dismiss();
        this.cancelar();
    }, 5000)
    
  }

  cancelar(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}
