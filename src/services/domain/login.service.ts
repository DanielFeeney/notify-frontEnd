import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.dto';
import { LocalUser } from '../../models/local-user';
import { StorageService } from '../application/storage.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { LoginDTO } from '../../models/login.dto';

@Injectable()
export class LoginService {

    jwtHelper : JwtHelperService = new JwtHelperService();

    constructor(public http: HttpClient, public StorageService: StorageService){}

    

    login(login : LoginDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, login, 
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

    cadastro(usuario : UsuarioDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/cadastro`, usuario, 
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    loginSucesso(authorizationValue: string){
        let token = authorizationValue.substring(7);
        let user: LocalUser = {
            token: token,
            cpf: this.jwtHelper.decodeToken(token).sub
        };
        this.StorageService.setLocalUser(user)
    }

    logout(){
        this.StorageService.setLocalUser(null);
    }
}