import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicsService {
  apiUrl = environment.apiUrl;
  constructor(
    private _authService : AuthenticationService,
    private _httpClient : HttpClient
  ) { }


  getDoctorClinis(){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this._authService.accessToken}`);
    reqHeaders = reqHeaders.append('Accept-Language',`en`);
    // return this._httpClient.get(`${this.apiUrl}doctor_clinics`,{headers : reqHeaders})
    return this._httpClient.get(`https://rx-egy.com/api/v2/doctor_clinics`,{headers : reqHeaders})

  }


  saveClinicData(url : any,formData : any,){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this._authService.accessToken}`);
    if(url === 'clinicData' || url === 'doctor_clinics'){
      return this._httpClient.post(`https://rx-egy.com/api/v2/${url}`,formData,{headers:reqHeaders})
    } else {
      return this._httpClient.post(`${this.apiUrl}${url}`,formData,{headers:reqHeaders})
    }
  }


  getAppointments(patientId:any){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this._authService.accessToken}`);
    reqHeaders = reqHeaders.append('Accept-Language',`en`);
    return this._httpClient.get(`${this.apiUrl}inClinic_appointments?patient_id=${patientId}`,{headers : reqHeaders})
  }

  getRxHistory(patientId:any){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this._authService.accessToken}`);
    reqHeaders = reqHeaders.append('Accept-Language',`en`);
    return this._httpClient.get(`${this.apiUrl}rx_history?patient_id=${patientId}`,{headers : reqHeaders})
  }



}
