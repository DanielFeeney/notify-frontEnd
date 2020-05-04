import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
   
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req)
       .subscribe(
           (data: any) =>{
               if(data.error){
                   let erro = data.error;
                   if(erro.error){
                       erro = erro.error;
                   }
                   if(!erro.status){
                       erro = JSON.parse(erro);
                   }

                   return Observable.throw(erro);
               }
           }
       ) as any;
    }

    

}

export const ErrorInterceptorProvider ={
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}