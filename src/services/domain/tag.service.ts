import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class TagService {
    constructor(public http: HttpClient, public storage: StorageService){}

    

    findAll(cpf : string): Observable<TagDTO[]> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag/${cpf}`,
        {'headers': authHeader});
    }

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

    save(tags: TagDTO[]) : Observable<TagDTO[]> {
        let token = this.storage.getLocalUser().token
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        return this.http.post<TagDTO[]>(`${API_CONFIG.baseUrl}/tag`, tags,
        {'headers': authHeader});
    }
}