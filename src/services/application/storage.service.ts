import { Injectable } from '@angular/core';
import { LocalUser } from '../../models/local-user';
import { STORAGE_KEYS } from '../../configuration/storage-keys.config';

@Injectable()
export class StorageService{
    getLocalUser(): LocalUser{
        let user = localStorage.getItem(STORAGE_KEYS.localUser);
        if(user == null){
            return null;
        }
        else{
            return JSON.parse(user)
        }
    }

    setLocalUser(user : LocalUser){
        if(user == null){
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }
        else{
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(user));
        }
    }
}