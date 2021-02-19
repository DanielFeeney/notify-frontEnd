import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { PerfilDTO } from '../../models/perfil.dto';
import { StorageService } from '../application/storage.service';

@Injectable()
export class PerfilService {
    constructor(public http: HttpClient, public storage: StorageService){}
    

    findAll(): Observable<PerfilDTO[]> {
        return this.http.get<PerfilDTO[]>(`${API_CONFIG.baseUrl}/perfil`
        );
    }

    findAllSignIn() : Observable<PerfilDTO[]> {
        return this.http.get<PerfilDTO[]>(`${API_CONFIG.baseUrl}/perfil/sign-in`
        );
    }
}