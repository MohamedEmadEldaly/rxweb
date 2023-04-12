import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastService } from 'src/app/core/_services/toast.service';

import { from } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxAgoraSdkNgService } from 'ngx-agora-sdk-ng';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
import { EncryptService } from 'src/app/core/_services/encrypt.service';
import { environment } from 'src/environments/environment';
// import {AgoraRTC} from 'agora-rtc-sdk';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  reactiveForm: FormGroup;
  password: string= 'password';
  isDetailsLoaderShow:boolean= false;
  isReadPrivacy:boolean= false;
  readPrivacyShow: boolean= false;
  isShowSignIn: boolean= true;
  UserStatus! : any;
  cachedUser : any = null;
  // signinRoute: string='auth/SignIn'
  emailRegx = new RegExp('/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,4}))$/')
  public register = { registerStepNum:0, token:"", personalInfo:{}};



  constructor(
    private agoraService: NgxAgoraSdkNgService,
    private fb: FormBuilder,
    public ToastService: ToastService, 
    private router : Router,
    private _authService : AuthenticationService,
    private validatorsService : ValidatorsService,
    private _crypto : EncryptService,
    private _activatedRoute : ActivatedRoute
    ) {

    this.reactiveForm = this.fb.group({
      email:['', [Validators.required, Validators.email,this.validatorsService.emailValidator()]],
      password: ['', [Validators.required, Validators.min(8)]]
    })
    
    if(this.router.getCurrentNavigation()?.extras.state != undefined){
      this.autoLoginObject = this.router.getCurrentNavigation()?.extras.state;
      this.reactiveForm.controls['email'].clearValidators();
      this.reactiveForm.controls['email'].updateValueAndValidity();

    }

  }

  JscachedUser : any;
  autoLoginObject : any = null;
  ngOnInit(): void {
    
    document.querySelector("body")?.classList.remove("gray-background");
    this.getAllDataFromCookies();

    
    // this.JscachedUser = localStorage.getItem("cachedUser")
    // this.cachedUser = JSON.parse(this.JscachedUser);
    // if(this.cachedUser){
    //   this.autoLoginObject = {
    //     email : this.cachedUser.email,
    //     password : this._crypto.decrypt(this.cachedUser.password)
    //   }
    // }
  }


  public startVideoCall(): void {
    // this.agoraService.setLocalVideoPlayer(this.localPlayer);
    // this.agoraService.startVideoCall(this.channelName, this.token);
    ////console.log("start video")
  }

  onSubmit() {
    //debugger
    if(this.reactiveForm.status == 'VALID') {
       this.submitSignData(this.reactiveForm.value)
    } else {
      // this.router.navigateByUrl('/DoctorRegister', { state: this.register });
    }
  }


  // autoLogin(){
  //   this.submitSignData(this.autoLoginObject)
  // }



  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }


  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';
  }

  assetUrl = environment.assetUrl;

  // login
  submitSignData(signInObject: any) {

    if(this.autoLoginObject){
      signInObject = {
        email : this.autoLoginObject.email,
        password :signInObject.password,
      }
    }

    // console.log(signInObject)

    this.isDetailsLoaderShow = true;

    this._authService.login(signInObject).
    subscribe((res: any) =>{
      // store token in auth service
      this._authService.accessToken = res.access_token;
      this._authService.currentUser.next(res.data.user);
      // store token in auth service

      //debugger
      this.register.token = res.access_token;

      let date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      let expires = "; expires=" + date.toLocaleString();
      document.cookie = 'userToken' + '=' +  res.access_token + ';expires=' + expires + ';path=/';
      document.cookie = 'isAssistant' + '=' +  true + ';expires=' + expires + ';path=/';


      let userInfo: any= {};
      userInfo = res.data.user;
      // which view will present
      this.register.registerStepNum = +res.data.user.status - 1;

      // console.log("userStatusFrom server",+res.data.user.status)
      this.UserStatus = +res.data.user.status;

      // console.log(res.data.user)
      //auto login
      if(+res.data.user.status === 6){
        const cachedUser = {
          email : signInObject.email,
          password : this._crypto.encrypt(signInObject.password),
          userName : res.data.user.en_name,
          userPhoto : `${this.assetUrl}${res.data.user.image}`,

        }
       localStorage.setItem("cachedUser",JSON.stringify(cachedUser));
      }
      //auto login



      // which view will present
      this.isDetailsLoaderShow = false;

      // if(Number(this.register.registerStepNum) === 1) {
      //   let status =  Number(res.data.user.status);
      //   // let status =  Number(res.data.user.status);
      //   this.isPrivacyShow()
      //   document.cookie = 'userStatus' + '=' +  status + ';expires=' + expires + ';path=/';
      //   this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });
      // }
      // else 
      
      if(Number(this.register.registerStepNum) < 5 ){
        // let privacyCookies = this.getSpecificCookie("privacyRead");

        // let status =  Number(res.data.user.status) - 1;
        this.isPrivacyShow(+res.data.user.status);
        let status =  Number(res.data.user.status);
        document.cookie = 'userStatus' + '=' +  status + ';expires=' + expires + ';path=/';
        // if(privacyCookies === 'true'){
        //   this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });
        // }
      } 
      
      // else if(+res.data.user.status === 5){
      //   document.cookie = 'userStatus' + '=' +  (this.register.registerStepNum + 1) + ';expires=' + expires + ';path=/';
      //   document.cookie = 'userPersonalInfo' + '=' +  JSON.stringify(userInfo) + ';expires=' + expires + ';path=/';

      //   this.register.personalInfo = res.data.user;
      //   this.router.navigateByUrl('Home', { state: this.register });
      // } 
      
      else {
        //debugger
        document.cookie = 'userStatus' + '=' +  this.register.registerStepNum + ';expires=' + expires + ';path=/';
        document.cookie = 'userPersonalInfo' + '=' +  JSON.stringify(userInfo) + ';expires=' + expires + ';path=/';
        this.register.personalInfo = res.data.user;
        this.router.navigateByUrl('Home', { state: this.register });
      }
    },
      err => {
        this.isDetailsLoaderShow = false;
        if(err.error.errors != undefined) {
          this.showSuccess(err.error.errors[0]);

        } else {
          this.showSuccess('حدث خطأ');

        }
        ////console.log("errrroooooooooooooooooooooors", err.error.errors)

      }
    )
  }
  // login



  checkInput(e:any) {
  
    if(e.target.checked == true) {
        this.isReadPrivacy = true;
    } else {
      this.isReadPrivacy = false;
    }

  }

  // complete doctor registeration
  privacyHandle(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    // document.cookie = 'privacyRead' + '=' +  'true' + ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  this.UserStatus + ';expires=' + expires + ';path=/';
    if(this.UserStatus === 1){
      this.register.registerStepNum = 0;
    }
    //console.log("handel p", this.UserStatus)
    this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });
  }
  // complete doctor registeration


  isPrivacyShow(status:any){
    // let privacyCookies = this.getSpecificCookie("privacyRead");
    // console.log(privacyCookies == 'true')
    if(status !== 1) {
      this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });
    } else {
      this.readPrivacyShow = true;
      this.isShowSignIn = false;
    }
  }


  privacyBack(){
    this.removeAllCookiesData();
    this.router.navigate(['/auth']);
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

  goToYourPage(status:any){
    //debugger
    status = Number(status);
    if(status == 6) {
      this.router.navigateByUrl('Home', { state: this.register });
    } else {

      this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });

    }

  }

  getUserPersonalObject(token:any,  personalInfo:any, status: any,) {
    this.register.token = token;
    this.register.registerStepNum = status;
    this.register.personalInfo = personalInfo;
  }

  getAllDataFromCookies(){
    //debugger
    let token = this.getSpecificCookie('userToken');
    let personalInfo = this.getSpecificCookie('userPersonalInfo');
    let userStatus = this.getSpecificCookie('userStatus');
    if(token != '') {
      if(personalInfo != '') {
        this.getUserPersonalObject(token,JSON.parse(personalInfo), userStatus);

      }
      this.goToYourPage(userStatus);

      ////console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)
    }
    // this.getUserPersonalObject(token,JSON.parse(personalInfo), userStatus);
    // this.goToYourPage(userStatus);
    // ////console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)


  }

  isMoreThanEightCh(): boolean {
   if(this.reactiveForm.controls.password.errors?.minLength?.actualLength <= 7 && this.reactiveForm.controls.password.errors?.minLength?.actualLength != 0) {
     return true
   }
   return false
  }
  // validEmail(control: AbstractControl): {[key: string]: boolean} | null{
  //   const emailRegx = new RegExp('/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,4}))$/')
  //   if(emailRegx.test(control.value)) {
  //     return {
  //       notValid: true

  //     };
  //   } else {
  //     return null
  //   }
  // }

 validEmail(): ValidatorFn {
    return (control: AbstractControl): { } | null => {
      const emailRegx = new RegExp('/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,4}))$/')
      if(emailRegx.test(control.value)) {
        return{ notValid: {notValiid: true}}
      } else {
        return null
      }
    };
  }
   forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  showPassword():void {
    if(this.password == 'text') {
      this.password = 'password'
    } else {
      this.password = 'text'
    }

  }


  showEnglishPrivacy = true;
  showArabicPrivacy = false;

  changePrivacy(privacyLang : string){
    if(privacyLang === 'english'){
      this.showArabicPrivacy = false;
      this.showEnglishPrivacy = true;
    } else {
      this.showArabicPrivacy = true;
      this.showEnglishPrivacy = false;
    }
  }

}
