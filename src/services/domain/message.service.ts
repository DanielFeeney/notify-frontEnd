import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed } from '@capacitor/core'
import { StorageService } from '../application/storage.service';
import {timeout} from 'rxjs/operators';
import {FCM} from 'capacitor-fcm';
import { API_CONFIG } from '../../configuration/api.config';


@Injectable()
export class MessageService {
    constructor(public http: HttpClient,  public storage: StorageService){}

    async register( fcm : FCM , allowPersonal: boolean){      

        await Plugins.PushNotifications.register();
        const {token} = await fcm.getToken();
        const formData = new FormData();
        formData.append('token', token);
        this.http.post(`${API_CONFIG.baseUrl}/message/register`, formData,
        )
          .pipe(timeout(10000))
          .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(allowPersonal)),
        _ => allowPersonal = !allowPersonal);
        return allowPersonal;        
      }

    async unregister( fcm : FCM, allowPersonal: boolean){

      
        await Plugins.PushNotifications.register();
        const {token} = await fcm.getToken();
        const formData = new FormData();
        formData.append('token', token);
        this.http.post(`${API_CONFIG.baseUrl}/message/unregister`, formData,
        )
            .pipe(timeout(10000))
            .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(allowPersonal)),
        _ => allowPersonal = !allowPersonal);
        return allowPersonal;
    }
}