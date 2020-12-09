import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public alertCtrl: AlertController) {
    }
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
         .pipe(
            catchError(error => {                   
              this.showError(error)
              return throwError(error);
            })
         );
      }

    async showError(error){
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

}

export const ErrorInterceptorProvider ={
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}