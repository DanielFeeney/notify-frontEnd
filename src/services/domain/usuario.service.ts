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

    jwtHelper : JwtHelperService = new JwtHelperService();

    constructor(public http: HttpClient, public StorageService: StorageService){}

    authHeader = new HttpHeaders({'Access-Control-Allow-Origin': '*'})

    

    login(usuario : UsuarioDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, usuario, 
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    loginSucesso(authorizationValue: string){
        let toke = authorizationValue.substring(7);
        let user: LocalUser = {
            token: toke,
            cpf: this.jwtHelper.decodeToken(toke).sub

        };
        this.StorageService.setLocalUser(user)
    }

    logout(){
        this.StorageService.setLocalUser(null);
    }

    criacao(cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token
        let authHeader2 = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/criacao`, formData,
        {'headers': authHeader2});
    }

    edicao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token
        let authHeader2 = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/edicao`, formData,
        {'headers': authHeader2});
    }

    delecao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        let token = this.StorageService.getLocalUser().token
        let authHeader2 = new HttpHeaders({"Authorization": "Bearer " + token})
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/usuario/delecao`, formData,
        {'headers': authHeader2});
    }
}