import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { StorageService } from '../application/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { timeout } from 'rxjs/operators';

@Injectable()
export class UsuarioService {

    constructor(public http: HttpClient, public StorageService: StorageService){}

    allUsers(): Observable<UsuarioDTO[]> {
        return this.http.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuario`,
        );
    }

    find(usuarioId : number): Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario/${usuarioId}`,
        );
    }

    buscarPerfil(): Observable<UsuarioDTO> {
        let cpf = this.StorageService.getLocalUser().cpf
        return this.http.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario/perfil/${cpf}`,
        );
    }

    delete(usuarioId: Number) {
          const formData = new FormData();
          formData.append('usuarioId', usuarioId.toString());
          
          const request = new HttpRequest('POST', `${API_CONFIG.baseUrl}/usuario/delete`, formData,
          )
          return this.http.request(request);
      }

    save(usuarios: UsuarioDTO) : Observable<UsuarioDTO> {
        return this.http.post<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario`, usuarios,
        );
    }

    mudarSenha(senha: string){
        const formData = new FormData();
        formData.append('senha', senha);
        formData.append('cpf', this.StorageService.getLocalUser().cpf);
        return this.http.post<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario/mudarSenha`, formData,
        );
    }

    resetarSenha(form: any){
        return this.http.post<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuario/resetarSenha`, form,
        );
    }
}