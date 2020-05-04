import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { TagService } from '../../../services/domain/tag.service';
import { TagDTO } from '../../../models/tag.dto';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/application/storage.service';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  filtros: TagDTO[] = [];

  cpf : string;

  constructor(
    public confData: ConferenceData,
    private config: Config,
    public modalCtrl: ModalController,
    private storage: StorageService,
    public router: Router,
    public TagService: TagService
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

    this.TagService.findAll(this.cpf).subscribe((filtros: any[]) => {
      this.filtros = filtros;
      this.filtros.forEach(e => e.cpfUsuario = this.cpf)
    });
  }

  selecionarTodos(check: boolean){
    this.filtros.forEach(filtro => {
          filtro.selecionado = check;
        });
  }

  salvar() {
    this.TagService.save(this.filtros).subscribe((filtros: any[]) => {
      this.filtros = filtros;
    });
    this.cancelar();
  }

  cancelar(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}
