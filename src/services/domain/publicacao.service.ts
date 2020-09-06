import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { PublicacaoDTO } from '../../models/publicacao.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class PublicacaoService {
    constructor(public http: HttpClient,  public storage: StorageService){}

    token = this.storage.getLocalUser().token
    authHeader = new HttpHeaders({"Authorization": "Bearer " + this.token})

    findAll(cpf : string, page: number = 0, linesPerPage : number = 24): Observable<PublicacaoDTO[]> {
        return this.http.get<PublicacaoDTO[]>(`${API_CONFIG.baseUrl}/publicacao/preferencias/${cpf}`,
        {'headers': this.authHeader});
    }

    getFavoritos(cpf: String):  Observable<PublicacaoDTO[]> {
        return this.http.get<PublicacaoDTO[]>(`${API_CONFIG.baseUrl}/favoritos/usuarios/${cpf}`,
        {'headers': this.authHeader});
    }

    find(idPublicacao: Number):  Observable<PublicacaoDTO> {
        return this.http.get<PublicacaoDTO>(`${API_CONFIG.baseUrl}/publicacao/${idPublicacao}`,
        {'headers': this.authHeader});
    }

    save(publicacao: PublicacaoDTO ): Observable<PublicacaoDTO>{
        return this.http.post<PublicacaoDTO>(`${API_CONFIG.baseUrl}/publicacao`, publicacao,
        {'headers': this.authHeader});
    }

    delete(idPublicacao: Number) {
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/publicacao/delete`, formData,
        {'headers': this.authHeader})
        return this.http.request(request);
    }

    


}