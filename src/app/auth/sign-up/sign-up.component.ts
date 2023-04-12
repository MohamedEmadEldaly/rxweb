import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { SignupService } from 'src/app/core/Http/signup.service';
import { ToastService } from 'src/app/core/_services/toast.service';

import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
//calling toast module
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  reactiveForm: FormGroup;
  confirmPassword: string = 'password';
  password: string = 'password';
  isValidRegister: boolean =false;
  // signupRoute: string = "auth/SignUp";
  registeredData: object = {
    body: 'data'
  }
  //  @ViewChild('myPasswords') myPasswords: any;
  public register = { registerStepNum:'0', token:"", personalInfo:{}};

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  isDetailsLoaderShow:boolean= false;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  constructor(private fb: FormBuilder,private router : Router, private SignupService: SignupService, public ToastService: ToastService,private validatorsService : ValidatorsService) {
    this.reactiveForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,this.validatorsService.emailValidator()]],
      phone: ['', [Validators.required,]],
      ar_name: ['', [Validators.required]],
      en_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), this.noWhitespaceValidator]],
      confirm_password: ['', [Validators.required,]],
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    }

    )
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password')?.value !== c.get('confirm_password')?.value) {
      return { invalid: true };
    }
    return { invalid: false };
  }
  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }

  onSubmit() {
    
    if (this.reactiveForm.status == 'VALID') {
      //debugger]
      this.reactiveForm.value.country_code = this.reactiveForm.value.phone['dialCode'];
      let sentData = this.reactiveForm.value;
      sentData.phone = this.reactiveForm.value.phone['nationalNumber'];
      this.sendDataRegistered(sentData)
    } else {
      // this.signupRoute = 'auth/SignUp'
    }


  }
  ngOnInit(): void {
    this.getAllDataFromCookies()
    // this.reactiveForm.valueChanges.map((value:any) => {
    //     // Here you can manipulate your value
    //     value.firstName = value.firstName.trim();
    //     return value;
    // })
    // .filter((value:any) => this.reactiveForm.valid)
    // .subscribe((value:any) => {
    //    ////console.log("Model Driven Form valid value: vm = ",JSON.stringify(value));
    // });


  }
  showConfirmPassword(): void {
    if (this.confirmPassword == 'text') {
      this.confirmPassword = 'password'
    } else {
      this.confirmPassword = 'text'

    }

  }
  showPassword(): void {
    if (this.password == 'text') {
      this.password = 'password'
    } else {
      this.password = 'text'

    }
  }

  updateRout() {
    ////console.log("submiiiit ", this.reactiveForm)
    if (this.reactiveForm.status == 'VALID' && this.isValidRegister == true) {
      // this.signupRoute = 'auth/SignIn'
      this.router.navigateByUrl('auth/SignIn');

    } else {
      // this.router.navigateByUrl('auth/SignIn');

    }

  }
  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';

  }
  sendDataRegistered(registeredData: object) {
    this.isDetailsLoaderShow = true;
    this.SignupService.sendRegisterData(registeredData).subscribe((res: any) => {
      this.isValidRegister = true
      // this.signupRoute = 'auth/SignIn'
      this.showSuccess('Pleas Check Your Email');
      this.removeAllCookiesData();
      this.router.navigateByUrl('auth/SignIn');
    this.isDetailsLoaderShow = false;

      // window.location.href = 'auth/SignIn'
    },
      err => {
        this.isDetailsLoaderShow = false;
        this.showSuccess(err.error.errors[0]);
        ////console.log("errrroooooooooooooooooooooors", err.error.errors)

      }
    )

    // ////console.log("registeredDataregisteredDataregisteredData", registeredData)

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
      this.getUserPersonalObject(token,JSON.parse(personalInfo), userStatus);
      this.goToYourPage(userStatus);

      ////console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)
    }
  }
  goToYourPage(status:any){
    //debugger
    status = Number(status);
    if(status == 6) {
      this.router.navigateByUrl('Home', { state: this.register });
    }else {
      this.router.navigateByUrl('auth/DoctorRegister', { state: this.register });

    }

  }
  getUserPersonalObject(token:any, status: any, personalInfo:any) {
    this.register.token = token;
    this.register.registerStepNum = status;
    this.register.personalInfo = personalInfo;
  }


  allowEnglishOnly($event : any){
    this.validatorsService.allowOnlyEnglish($event)
  }

  allowArabicOnly($event : any){
    this.validatorsService.allowOnlyArabic($event)
  }

  noSpacesEvent($event : any){
    this.validatorsService.noSpacesEvent($event)
  }

}
