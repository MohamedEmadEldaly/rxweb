import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'


@Injectable({
  providedIn: 'root'
})
export class EncryptService {


  secretKey = "rxwebkey34523233";

  constructor() {
  }

  
  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(value : string){
    return CryptoJS.AES.decrypt(value, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

}
