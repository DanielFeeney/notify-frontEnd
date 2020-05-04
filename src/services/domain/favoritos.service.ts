import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class FavoritosService {
    constructor(public http: HttpClient, public storage: StorageService){}

    token = this.storage.getLocalUser().token
    authHeader = new HttpHeaders({"Authorization": "Bearer " + this.token})

    save(idPublicacao : Number, cpf : string) {
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('idUsuario', cpf);
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/favoritos/save`, formData,
        {'headers': this.authHeader})
        return this.http.request(request);
    }

    delete(idPublicacao : Number, cpf : string) {
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('idUsuario', cpf);
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/favoritos/delete`, formData,
        {'headers': this.authHeader})
        return this.http.request(request);
    }

    find(idPublicacao : Number, cpf : string): Observable<Boolean> {
        return this.http.get<Boolean>(`${API_CONFIG.baseUrl}/favoritos/verificar/${idPublicacao}/${cpf}`,
        {'headers': this.authHeader});
    }
}