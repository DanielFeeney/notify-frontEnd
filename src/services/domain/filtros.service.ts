import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { TagDTO } from '../../models/tag.dto';
import { StorageService } from '../application/storage.service';
import { storage } from 'firebase';

@Injectable()
export class FiltrosService {
    constructor(public http: HttpClient, public storage: StorageService){}

    getCpf(){
        return this.storage.getLocalUser().cpf;
    }

    

    findAll(): Observable<TagDTO[]> {
        return this.http.get<TagDTO[]>(`${API_CONFIG.baseUrl}/filtros/${this.getCpf()}`
        );
    }

    save(tags: TagDTO[]) : Observable<TagDTO[]> {
        return this.http.post<TagDTO[]>(`${API_CONFIG.baseUrl}/filtros`, tags
        );
    }

    validarEnviarMsg(): Observable<Boolean> {
        return this.http.get<Boolean>(`${API_CONFIG.baseUrl}/filtros/validarEnviarMsg/${this.getCpf()}`
        );
    }
}