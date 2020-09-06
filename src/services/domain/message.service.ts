import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { API_CONFIG } from '../../../../notify/tcc/src/configuration/api.config';
import { Observable } from 'rxjs';
import { LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed } from '@capacitor/core'
import { StorageService } from '../application/storage.service';
import {timeout} from 'rxjs/operators';
import {FCM} from 'capacitor-fcm';


@Injectable()
export class MessageService {
    constructor(public http: HttpClient,  public storage: StorageService){}

    token = this.storage.getLocalUser().token
    authHeader = new HttpHeaders({"Authorization": "Bearer " + this.token})

    async register( fcm : FCM , allowPersonal: boolean){
        await Plugins.PushNotifications.register();
        const {token} = await fcm.getToken();
        const formData = new FormData();
        formData.append('token', token);
        this.http.post(`${API_CONFIG.baseUrl}/message/register`, formData, {'headers': this.authHeader})
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
        this.http.post(`${API_CONFIG.baseUrl}/message/unregister`, formData, {'headers': this.authHeader})
            .pipe(timeout(10000))
            .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(allowPersonal)),
        _ => allowPersonal = !allowPersonal);
        return allowPersonal;
    }
}