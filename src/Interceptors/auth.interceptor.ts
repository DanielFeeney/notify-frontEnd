import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/application/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(public storage: StorageService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req)
       let localUser = this.storage.getLocalUser();
       console.log(localUser.token)

       if(localUser){
           const authReq = req.clone({
               headers: req.headers.set(
                   'Authorization', 
                   'Bearer ' + localUser.token)
           });
           console.log(next.handle(authReq))
           return next.handle(authReq)
       }
        else{
            return next.handle(req)
        }
       
    }

    

}

export const AuthInterceptorProvider ={
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}