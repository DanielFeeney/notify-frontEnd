import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { TagDTO } from '../../../models/tag.dto';
import { PublicacaoService } from '../../../services/domain/publicacao.service';
import { PublicacaoDTO } from '../../../models/publicacao.dto';
import { FavoritosService } from '../../../services/domain/favoritos.service';
import { StorageService } from '../../../services/application/storage.service';

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
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private PublicacaoService: PublicacaoService,
    private storage: StorageService,
    public router: Router,
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
      this.filtros = data.colTag;
    });

     this.FavoritosService.find(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>
     this.isFavorite = data
     );

     this.PublicacaoService.edicao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
       console.log(data)
       this.editar = data;
     });

     this.PublicacaoService.delecao(+this.idPublicacao, this.cpf).subscribe((data: boolean) =>{
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
}
