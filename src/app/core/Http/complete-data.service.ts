import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env, environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompleteDataService {
  constructor(private http: HttpClient) { }

  apiUrl = environment.apiUrl;
  sendRegisterData(body: object, HttpHeaders: any) : Observable<any>{
    return this.http.post(`${this.apiUrl}completeData`, body, HttpHeaders)
     // //console.log(env.apiRoot)
   }
}
