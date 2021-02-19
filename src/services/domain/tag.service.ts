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
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag/publicacao/${idPublicacao}`,
        );
    }

    allTags(): Observable<TagDTO[]> {
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/tag`,
        );
    }

    find(tagId : number): Observable<TagDTO> {
        return this.http.get<TagDTO>(`${API_CONFIG.baseUrl}/tag/${tagId}`,
        );
    }

    delete(tagId: Number) {
          const formData = new FormData();
          formData.append('tagId', tagId.toString());
          
          const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/tag/delete`, formData,
          )
          return this.http.request(request);
      }

    save(tags: TagDTO) : Observable<TagDTO> {
        return this.http.post<TagDTO>(`${API_CONFIG.baseUrl}/tag`, tags,
        );
    }
}