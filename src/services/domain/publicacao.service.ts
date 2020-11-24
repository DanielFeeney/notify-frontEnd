import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { PublicacaoDTO } from '../../models/publicacao.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class PublicacaoService {
    constructor(public http: HttpClient,  public storage: StorageService){}

    findAll(cpf : string, page: number = 0, linesPerPage : number = 24): Observable<PublicacaoDTO[]> {
        
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<PublicacaoDTO[]>(`${API_CONFIG.baseUrl}/publicacao/preferencias/${cpf}/${page}/${linesPerPage}`,
        {'headers': authHeader,});
    }

    getFavoritos(cpf: String):  Observable<PublicacaoDTO[]> {
        
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<PublicacaoDTO[]>(`${API_CONFIG.baseUrl}/favoritos/usuarios/${cpf}`,
        {'headers': authHeader});
    }

    find(idPublicacao: Number):  Observable<PublicacaoDTO> {
        
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<PublicacaoDTO>(`${API_CONFIG.baseUrl}/publicacao/${idPublicacao}`,
        {'headers': authHeader});
    }

    save(publicacao: PublicacaoDTO, blob: Blob ){
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})

      const formData = new FormData();

      if(blob)
      formData.append('file', blob, `file.jpg`);

      if(publicacao.id)
      formData.append('id', publicacao.id);
      formData.append('titulo', publicacao.titulo);
      if(publicacao.subTitulo){
        formData.append('subTitulo', publicacao.subTitulo);
        console.log(publicacao.subTitulo)
      }
            
      formData.append('descricao', publicacao.descricao);
      formData.append('cpf', publicacao.cpfUsuario);
      
      publicacao.colTagDTO.forEach(tag => {
        if(tag.selecionado){
          formData.append('listaTag', tag.id );
        }
      });
      

      const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/publicacao`, formData,
        {'headers': authHeader})
        return this.http.request(request);
    }

    delete(idPublicacao: Number) {
        
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/publicacao/delete`, formData,
        {'headers': authHeader})
        return this.http.request(request);
    }


    getImage(idPublicacao: Number) {
        
      let token = this.storage.getLocalUser().token
      let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        
      return this.http.get(`${API_CONFIG.baseUrl}/publicacao/imagem/${idPublicacao}`,
      {'headers': authHeader,
        responseType: 'arraybuffer'});
    }

    


}