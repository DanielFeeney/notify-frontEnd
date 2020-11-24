import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class TagService {
    constructor(public http: HttpClient, public storage: StorageService){}

    findAllByPublicacao(idPublicacao : number): Observable<TagDTO[]> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag/publicacao/${idPublicacao}`,
        {'headers': authHeader});
    }

    allTags(): Observable<TagDTO[]> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag`,
        {'headers': authHeader});
    }

    find(tagId : number): Observable<TagDTO> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<TagDTO>(`${API_CONFIG.baseUrl}/tag/${tagId}`,
        {'headers': authHeader});
    }

    permissao(): Observable<TagDTO> {
        let token = this.storage.getLocalUser().token
        let cpf = this.storage.getLocalUser().cpf
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<TagDTO>(`${API_CONFIG.baseUrl}/tag/permissao/${cpf}`,
        {'headers': authHeader});
    }

    delete(tagId: Number) {
        
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
          const formData = new FormData();
          formData.append('tagId', tagId.toString());
          
          const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/tag/delete`, formData,
          {'headers': authHeader})
          return this.http.request(request);
      }

    save(tags: TagDTO) : Observable<TagDTO> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.post<TagDTO>(`${API_CONFIG.baseUrl}/tag`, tags,
        {'headers': authHeader});
    }
}