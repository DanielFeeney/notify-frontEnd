import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../../configuration/api.config';
import { Observable } from 'rxjs';
import { StorageService } from '../application/storage.service';
import { TagDTO } from '../../models/tag.dto';
import { timeout } from 'rxjs/operators';

@Injectable()
export class PermissaoService {

    constructor(public http: HttpClient, public StorageService: StorageService){}

    criacao(cpf: string):  Observable<Boolean> {
        const formData = new FormData();
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/permissao/criacao`, formData,
        );
    }

    edicao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/permissao/edicao`, formData,
        );
    }

    delecao(idPublicacao : Number ,cpf: string):  Observable<Boolean> {
        const formData = new FormData();
        formData.append('idPublicacao', idPublicacao.toString());
        formData.append('cpf', cpf);
        return this.http.post<Boolean>(`${API_CONFIG.baseUrl}/permissao/delecao`, formData,
        );
    }

    tagUsuario(cpf: string): Observable<Boolean> {
        return this.http.get<Boolean>(`${API_CONFIG.baseUrl}/permissao/tagUsuario/${cpf}`,
        );
    }

    atualizarToken(token: string, cpf: string): Observable<any>{
        const formData = new FormData();
        formData.append('token', token);
        formData.append('cpf', cpf)
        return this.http.post(`${API_CONFIG.baseUrl}/message/atualizaToken`, formData)
        .pipe(timeout(10000));
    }

    proprioUsuario(cpfA : String) : boolean{
        let cpfB = this.StorageService.getLocalUser().cpf
        if(cpfA === cpfB){
            return true;
        }
        return false;
    }
}