import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class FavoritosService {
    constructor(public http: HttpClient, public storage: StorageService){}

    save(idPublicacao : Number, cpf : string) {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})

        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/favoritos/save`, formData,
        {'headers': authHeader})
        return this.http.request(request);
    }

    delete(idPublicacao : Number, cpf : string) {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})

        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        
        const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/favoritos/delete`, formData,
        {'headers': authHeader})
        return this.http.request(request);
    }

    find(idPublicacao : Number, cpf : string): Observable<Boolean> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})

        return this.http.get<Boolean>(`${API_CONFIG.baseUrl}/favoritos/verificar/${idPublicacao}/${cpf}`,
        {'headers': authHeader});
    }
}