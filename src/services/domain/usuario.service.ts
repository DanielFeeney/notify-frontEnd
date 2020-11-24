import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.dto';
import { LocalUser } from '../../models/local-user';
import { StorageService } from '../application/storage.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class UsuarioService {

    constructor(public http: HttpClient, public StorageService: StorageService){}

    criacao(cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token == null ? null : this.StorageService.getLocalUser().token;
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/criacao`, formData,
        {'headers': authHeader});
    }

    edicao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token == null ? null : this.StorageService.getLocalUser().token;
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/edicao`, formData,
        {'headers': authHeader});
    }

    delecao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token == null ? null : this.StorageService.getLocalUser().token;
        let authHeader = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/delecao`, formData,
        {'headers': authHeader});
    }
}