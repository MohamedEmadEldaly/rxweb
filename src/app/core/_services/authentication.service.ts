import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptService } from './encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  currentUser = new BehaviorSubject<any>(null)
  apiUrl = environment.apiUrl;
  accessToken : string = "";

  constructor(private _httpClient : HttpClient,private _crypto : EncryptService) { }

  login(user : any){
    return this. _httpClient.post(`${this.apiUrl}login`, user)
  }


  resetPassword(data : any){
    console.log(data)
    return this._httpClient.post(`${this.apiUrl}password/email`,{email:data})
  }



  getAccessCode(){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this.accessToken}`);
    reqHeaders = reqHeaders.append('Accept-Language',`en`);
    return this._httpClient.get(`${this.apiUrl}accessCode`,{
      headers : reqHeaders
    })
  }


  getUserStatus(){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this.accessToken}`);
    reqHeaders = reqHeaders.append('Accept-Language',`en`);
    return this._httpClient.get(`${this.apiUrl}status`,{
      headers : reqHeaders
    })
  }


  assetUrl = environment.assetUrl;


  updateCachedUser(key :any,value:any){
    const oldCachedUser =  JSON.parse(`${localStorage.getItem("cachedUser")}`);
    if(key === 'password'){
      oldCachedUser[key] = this._crypto.encrypt(value);
      localStorage.setItem("cachedUser",JSON.stringify(oldCachedUser))
    } else if(key === "userPhoto"){
      oldCachedUser[key] = `${this.assetUrl}${value}`;
      localStorage.setItem("cachedUser",JSON.stringify(oldCachedUser))
    } else {
      oldCachedUser[key] = value;
      localStorage.setItem("cachedUser",JSON.stringify(oldCachedUser))
    }
  }

}
