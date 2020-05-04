import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class TagService {
    constructor(public http: HttpClient, public storage: StorageService){}

    token = this.storage.getLocalUser().token
    authHeader = new HttpHeaders({"Authorization": "Bearer " + this.token})
    

    findAll(cpf : string): Observable<TagDTO[]> {
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag/${cpf}`,
        {'headers': this.authHeader});
    }

    allTags(): Observable<TagDTO[]> {
        console.log("ta aqui")
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag`,
        {'headers': this.authHeader});
    }

    save(tags: TagDTO[]) : Observable<TagDTO[]> {
        return this.http.post<TagDTO[]>(`${API_CONFIG.baseUrl}/tag`, tags,
        {'headers': this.authHeader});
    }
}