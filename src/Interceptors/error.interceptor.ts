import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { StorageService } from "../services/application/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService, public alertCtrl: AlertController) {
    }
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
         .pipe(
            catchError(error => {                   
                switch(error.status) {
                    case 0:
                        this.handle0()
                        break;
                    case 401:
                    this.handle401();
                    break;
    
                    case 403:
                    this.handle403();
                    break;

                    case 404:
                    this.handle404();
                    break;

                    case 409:
                    this.handle409();
                    break;
    
                    case 422:
                    this.handle422(error);
                    break;
    
                    default:
                    this.handleDefaultEror(error);
                }
              return throwError(error);
            })
         );
      }

      async handle0(){
        let alert = await this.alertCtrl.create({
            header: 'Falha de conexão com o servidor',
            message: 'Aguarde em quanto consertamos o problema',
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }

      async handle401(){
        let alert = await this.alertCtrl.create({
            header: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }

      handle403() {
        this.storage.setLocalUser(null);
    }

    async handle404(){
        let alert = await this.alertCtrl.create({
            header: 'Erro de requisição',
            message: "Pare, respire e tente novamente",
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }

    async handle409(){
        let alert = await this.alertCtrl.create({
            header: 'Erro de conflito',
            message: "E-mail ou CPF já cadastrados",
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }

    async handle422(error){
        let alert = await this.alertCtrl.create({
            header: 'Erro 422: Validação',
            message: this.listErrors(error.errors),
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }


    async handleDefaultEror(error){
        let alert = await this.alertCtrl.create({
            header: 'Erro ' + error.status + ': ' + error.error,
            message: error.message,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present(); 
    }

    private listErrors(messages : string[]) : string {
        let s : string = '';
        for (var i=0; i<messages.length; i++) {
            s = s + '<p><strong>' + messages[i] + "</strong> </p>";
        }
        return s;
    }

}

export const ErrorInterceptorProvider ={
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}