import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env, environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }
  apiUrl = environment.apiUrl;

  sendRegisterData(body: object) : Observable<any>{
    return this.http.post(`${this.apiUrl}register`, body)
     // //console.log(env.apiRoot)
   }

}
