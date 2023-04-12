import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';

@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss']
})
export class WelcomeCardComponent implements OnInit {
  public register = { registerStepNum:'0', token:"", personalInfo:{}};


  cachedUser : any = null;

  JscachedUser : any;
  autoLoginObject : any;
  
  _unsubscribeAll = new Subject();

  constructor(private router : Router,private _authService : AuthenticationService) {

  }

  ngOnInit(): void {

    document.querySelector("body")?.classList.remove("gray-background");
    this.getAllDataFromCookies();


    this.JscachedUser = localStorage.getItem("cachedUser")
    this.cachedUser = JSON.parse(this.JscachedUser);
    if(this.cachedUser){
      this.autoLoginObject = {
        email : this.cachedUser.email,
        userPhoto : this.cachedUser.userPhoto,
        userName : this.cachedUser.userName
      }
    }


   
  }


  autoLogin(){
    this.router.navigate(['/auth/SignIn'],{state : this.autoLoginObject})
  }

  getSpecificCookie(cname: any) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  getAllDataFromCookies(){
    //debugger
    let token = this.getSpecificCookie('userToken');
    let personalInfo = this.getSpecificCookie('userPersonalInfo');
    let userStatus = this.getSpecificCookie('userStatus');

    if(token != '') {
      if(personalInfo != '') {
        this.getUserPersonalObject(token,JSON.parse(personalInfo), userStatus);
        //save to auth service 
        this._authService.currentUser.next(personalInfo);
        this._authService.accessToken = token;
        //save to auth service 
      }


    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();




    this._authService.getUserStatus()
    .pipe(
      takeUntil(this._unsubscribeAll)
      )
    .subscribe((res:any) => {
      this.goToYourPage(res.data);
      // console.log(res)
    });




      ////console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)
    }
  }



  goToYourPage(status:any){
    // console.log(status)
    //debugger
    status = Number(status);
    if(status == 6) {
      this.router.navigateByUrl('Home', { state: this.register });
    } else {
      this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });
    }
  }


  getUserPersonalObject(token:any,  personalInfo:any, status: any) {
    this.register.token = token;
    this.register.registerStepNum = status;
    this.register.personalInfo = personalInfo;
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();

  }


}
