import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { mergeMapTo, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import * as firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private _httpClient : HttpClient,
    private _authService : AuthenticationService,
    private _angularFireMessaging : AngularFireMessaging,
    private _toastr : ToastrService
    ) {
    this._angularFireMessaging.usePublicVapidKey("BAvnkvmU160LUt97j9WWYtVoHMIKqSC0_UDgkqr-9caFZ8Wucuas6SPjO8FIjOzT_c1GIOUnYyJ_iazIMfCneC8");
    }

  apiUrl = environment.apiUrl;

  currentMessage = new BehaviorSubject<any>(null);
  
  updateFirebase(type=3,token : any){
    let reqHeaders = new HttpHeaders();
    reqHeaders = reqHeaders.append('Authorization',`Bearer ${this._authService.accessToken}`);
    // console.log(this._authService.accessToken)
    return this._httpClient.post(`${this.apiUrl}firebaseUpdate`,{type,fcm_token : token},{headers:reqHeaders})
  }


  requestPermission(){
    this._angularFireMessaging.requestPermission
    .subscribe(
      (token) => {
        this.requestToken();
        // this._toastr.success("premission grantd Successfuly!")
      },
      (error) => { 
        // setInterval(()=>{
        //   // const message = {
        //   //   title:"Notification Setting",
        //   //   message : "Please Enable notification Setting"
        //   // }
        //   // this.currentMessage.next(message);
        //   // setTimeout(() => {
        //   //   clearInterval();
        //   //   this.currentMessage.next(null);
        //   // }, 20000);

        // },20000);
       },  
    );
  }

  requestToken() {
    this._angularFireMessaging.tokenChanges
      .pipe(
        switchMap((token)=>{
          return this.updateFirebase(3,token)
        })
      )
      .subscribe(
        (token) => {
          // console.log("success")
        },
        (error) => { 
          // this._toastr.error("Faild to request token!")
         },  
      );
  }
 
  receiveMessage() {
    this._angularFireMessaging.onMessage((payload) => {
      const message = {
        title:payload?.notification?.title,
        message : payload?.notification?.body
      }
      this.currentMessage.next(message)
      setTimeout(() => {
      this.currentMessage.next(null)
      }, 20000);
     
    });
  }

}
