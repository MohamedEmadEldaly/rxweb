import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env, environment } from '../../../environments/environment';

import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }
  apiUrl = environment.apiUrl;

  getSpecialitiesList() {
    // return this.http.get(`${this.apiUrl}specialitiesWithDegres`,
    //   {
    //     params: { page: '20' },
    //     headers: { guest: 'true' }
    //   }
    // )
     return this.http.get(`${this.apiUrl}specialitiesWithDegres`)

    // //console.log(env.apiRoot)
  }
}
