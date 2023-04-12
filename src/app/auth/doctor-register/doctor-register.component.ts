import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationStart  } from '@angular/router';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { RegisterService } from 'src/app/core/Http/register.service';
import { CompleteDataService } from 'src/app/core/Http/complete-data.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { ConstantPool } from '@angular/compiler';
import { formatDate } from '@angular/common';
import { ClinicsService } from 'src/app/core/_services/clinics.service';
import { take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ValidatorsService } from 'src/app/core/_services/validators.service';


@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./doctor-register.component.scss']
})
export class DoctorRegisterComponent implements OnInit,OnDestroy {
  [x: string]: any;
  registerStepNum: any;
  accessToken: any;
  public currentStep = 0;
  doctorClinisData:any;
  isLoaderShow:boolean = false;
  isClinicRegister: boolean= false;
  removeSteptwoData:boolean= false;

  _unsubscribeAll = new Subject();

  @ViewChild('stepper', { static: true })
  public stepper: StepperComponent | undefined;
  public register = { registerStepNum:'0', token:"", personalInfo:{}};
  isAddClinicFinish:boolean= false;
  constructor(
    private registerServices: RegisterService,
    private http: HttpClient,
    public ToastService: ToastService, 
    private activatedroute:ActivatedRoute,
    private router:Router, 
    private CompleteDataService: CompleteDataService,
    private _clinicsService : ClinicsService,
    private _authService : AuthenticationService,
    private _toastrService : ToastrService,
    private ValidatorsService : ValidatorsService,
    private validatorService : ValidatorsService
    ) {
    this.activatedroute.data.subscribe((data: any) => {
      ////console.log("activated routr doctor register",this.router.getCurrentNavigation()?.extras.state?.registerStepNum)
      //debugger
      // this.currentStep = this.router.getCurrentNavigation()?.extras.state?.registerStepNum || +this.getSpecificCookie("userStatus");
      // //console.log(this.currentStep)

      // get data passed from signin if doctor not complete register ( token , user, status);
      // console.log("hello")
      if(this.router.getCurrentNavigation()?.extras.state != undefined) {
        this.currentStep = Number(this.router.getCurrentNavigation()?.extras.state?.registerStepNum);
        // console.log("doctor register current step",this.currentStep)
        this.accessToken = this.router.getCurrentNavigation()?.extras.state?.token
        this.register.token = this.router.getCurrentNavigation()?.extras.state?.token
      }
      // get data passed from signin if doctor not complete register


    })
  }
  ngOnInit(): void {
    this.product=history.state;
    this.getAllDataFromCookies();
    this.getDoctorClinics();
  }
  // public register = { registerStepNum:'0', token:"", personalInfo:{}};
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
      this.accessToken = token;
      this.getUserPersonalObject(token,'', userStatus);
      this.goToYourPage(userStatus);


      //save to auth service
      this._authService.accessToken = token;
      this._authService.currentUser.next(personalInfo)
      //save to auth service

      //debugger
      // if( this.currentStep != 0) {
      //   this.currentStep= Number(userStatus) - 1;

      // } else {
      //   this.currentStep =  Number(userStatus) - 1;
      // }

      this._authService.getUserStatus()
      .pipe(
        take(1)
      )
      .subscribe((res:any)=>{
       this.currentStep = +res.data - 1;
      })

      // ////console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)
    }
  }

  addCookiesCurrentStep() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    let cookiesCurrent = Number(this.currentStep) + 1
    if(this.currentStep == 4) {
      cookiesCurrent = 6
    }
    document.cookie = 'userStatus' + '=' +  cookiesCurrent + ';expires=' + expires + ';path=/';
    document.cookie = 'userPersonalInfo' + '=' +  JSON.stringify(this.register.personalInfo) + ';expires=' + expires + ';path=/';

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

  getUserPersonalObject(token:any,  personalInfo:any, status: any) {
    this.register.token = token;
    this.register.registerStepNum = status;
    this.register.personalInfo = personalInfo;
  }


  // select step number with data
  submitStepData(stepObject: any, curentStep: any) {

    if(this.currentStep == 1){
        if(stepObject?.selected_days?.length > 0){
            this.isLoaderShow = true;
            let formData, url;
            formData = this.constructStepTwoObject(stepObject);
            url = `clinicData`;
            this._clinicsService.saveClinicData(url,formData)
            .pipe(
          takeUntil(this._unsubscribeAll)
            ).subscribe((res : any) => {
              //debugger
              this.isLoaderShow = false;
              let userStatus = this.getSpecificCookie('userStatus');
        
              if(this.currentStep == 1) {
        
                if(res.code !== 200){
                  // console.log("currentStep",this.currentStep);
                  // console.log("res",res);
                  this._toastrService.error(res.errors[0],"Error")
                } else {
                  this.isAddClinicFinish = !this.isAddClinicFinish;
                }
                
              }
              //debugger
              if(this.currentStep != 1){
                this.addCookiesCurrentStep()
                this.currentStep += 1;
              } else {
                this.isClinicRegister = true;
                this.getDoctorClinics()
              }
        
              if(curentStep == 4) {
                this.register.personalInfo = res.data.user;
                this.firstTimeLogin();
                // curentStep = curentStep + 1
                this.addCookiesCurrentStep();
                this.router.navigateByUrl('/Home', { state: this.register });
              }
              curentStep = curentStep + 1
        
              if(Number(userStatus) != curentStep) {
                this.addCookiesCurrentStep();
              }
        
              this.removeSteptwoData = true;
            },
            (error) => {
        
              // this.validatorService.handelError(error)
              this._toastrService.error(error?.error?.message,"error");
              // console.log(error.error.errors[0])
              this.removeSteptwoData = true;
              this.isLoaderShow = false;
        
            })
        } else {
          this.showSuccess("إدخال مواعيد العمل!")
        }
    } else {
      this.isLoaderShow = true;
      let formData, url;
      if(curentStep == 0) {
        formData = this.constructStepOneObject(stepObject);
        url = `completeData`
     } 
     else if (curentStep == 2) {
       formData = this.constructStepThreeObject(stepObject);
       url = `doctor-consultation`
     }
     else if (curentStep == 3) {
       formData = this.constructStepFourObject(stepObject);
       url = `doctor_signature`
     }
     else if (curentStep == 4) {
       formData = this.constructStepFiveObject(stepObject);
       url = `doctorCode`
     }
 
     this._clinicsService.saveClinicData(url,formData)
     .pipe(
       takeUntil(this._unsubscribeAll)
     ).subscribe((res : any) => {
       //debugger
       this.isLoaderShow = false;
       let userStatus = this.getSpecificCookie('userStatus');
 
       if(this.currentStep == 1) {
 
         if(res.code !== 200){
           // console.log("currentStep",this.currentStep);
           // console.log("res",res);
           this._toastrService.error(res.errors[0],"Error")
         } else {
           this.isAddClinicFinish = !this.isAddClinicFinish;
         }
        
       }
       //debugger
       if(this.currentStep != 1){
         this.addCookiesCurrentStep()
         this.currentStep += 1;
       } else {
         this.isClinicRegister = true;
         this.getDoctorClinics()
       }
 
       if(curentStep == 4) {
         this.register.personalInfo = res.data.user;
         this.firstTimeLogin();
         // curentStep = curentStep + 1
         this.addCookiesCurrentStep();
         this.router.navigateByUrl('/Home', { state: this.register });
       }
       curentStep = curentStep + 1
 
       if(Number(userStatus) != curentStep) {
         this.addCookiesCurrentStep();
       }
 
       this.removeSteptwoData = true;
     },
     (error) => {
 
       // this.validatorService.handelError(error)
       this._toastrService.error(error?.error?.message,"error");
       // console.log(error.error.errors[0])
       this.removeSteptwoData = true;
       this.isLoaderShow = false;
 
     })
    }
   
   

  
  }
  // select step number with data


  constructStepOneObject(stepObject: any) {
    const formData = new FormData();
    formData.append('image', stepObject.image);
    formData.append('speciality_id', stepObject.speciality_id);
    formData.append('degre_id', stepObject.degre_id);
    formData.append('university', stepObject.university);
    formData.append('consolto', stepObject.consolto);
    formData.append('note', stepObject.note);
    return formData;
  }

  constructStepTwoObject(stepObject: any) {

    // //console.log("constract",stepObject)

    //debugger
    // const formData = new FormData();
    // formData.append('name', stepObject.name);
    // formData.append('phone', stepObject.phone);
   
    // formData.append('lat', stepObject.lat);
    // formData.append('lng', stepObject.lng);
    // formData.append('address', stepObject.address);
    // formData.append('currency', stepObject.currency);
    // formData.append('fees_regular', stepObject.fees_regular);  // michaelgirgis01@gmail.com
    // formData.append('fees_recheck', stepObject.fees_recheck);
    // formData.append('fees_urgent', stepObject.fees_urgent);
    // formData.append('flag', stepObject.flag);

    // formData.append('clinic_id', stepObject.clinic_id);
    // formData.append('selected_days', stepObject.selected_days);  // michaelgirgis01@gmail.com

    // stepObject.selected_days.forEach(function (ele:any, i: number) {
    //    formData.append(`selected_days[${i}]`, ele);
    // })


  
    delete stepObject.to;
    delete stepObject.from;

    stepObject.clinic_id = "";



    // return formData;
    // console.log(stepObject)

      return stepObject;
  }

  constructStepThreeObject(stepObject: any) {
    const formData = new FormData();
   

    if(stepObject.is_video_call === undefined || stepObject.is_video_call == 0 ){
      formData.append('video_call_currency', "");
      formData.append('fees_video_call', "");
      formData.append('video_from', "");
      formData.append('video_to', "");
      formData.append('video_selected_days[0]', "");
    }

    if(stepObject.is_home_visit === undefined || stepObject.is_home_visit == 0){
      formData.append('fees_home_visit', "");
      formData.append('currency', "");
    }


    formData.append('is_video_call', stepObject.is_video_call === undefined ? "0" : stepObject.is_video_call);
    formData.append('is_home_visit', stepObject.is_home_visit === undefined ? "0" : stepObject.is_home_visit);

    if(stepObject.is_home_visit == 1) {
      formData.append('fees_home_visit', stepObject.fees_home_visit);
      formData.append('currency', stepObject.currency);
    }
    if(stepObject.is_video_call == 1) {
      formData.append('video_from', stepObject.video_from);
      formData.append('video_to', stepObject.video_to);
      formData.append('video_call_currency', stepObject.video_call_currency);
      formData.append('fees_video_call', stepObject.fees_video_call);
      stepObject.video_selected_days.forEach(function (ele:any, i: number) {
        formData.append(`video_selected_days[${i}]`, ele);
        // value.selected_days[i] = ele
      })

    }

    return formData;
  }


  handelBack(){
    this.removeAllCookiesData();
    this.router.navigate(["/auth"])
  }


  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';
  }

  constructStepFourObject(stepObject: any) {
    const formData = new FormData();
    formData.append('signature_image', stepObject.signature_image);
    return formData;

  }

  constructStepFiveObject(stepObject: any) {
    const formData = new FormData();
    formData.append('access_code', stepObject.access_code);
    return formData;
  }

  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index)?.touched && this.currentStep >= index;
  };

  public stepsObject={
    stepOne: {
      image:'',
      degre_id: '',
      university: '',
      speciality_id: '',
      consolto: 0,
      note:''
    },
    stepTwo: Object,
    stepThree: Object,
    stepFour: {
      signature_image: ''
    },
    stepFive: {
      access_code: ''
    }
  }

  stepImageFile: any;
  formDataStepOne = new FormData();

  public steps = [
    {
      label: "Doctor's Details",
      isValid: this.isStepValid,
      validate: this.shouldValidate
    },
    {
      label: 'Clinic Data',
      isValid: this.isStepValid,
      validate: this.shouldValidate
    },
    {
      label: 'Consultation',
      isValid: this.isStepValid,
      validate: this.shouldValidate
    },
    {
      label: 'Signature',
      isValid: this.isStepValid,
      validate: this.shouldValidate
    },
    {
      label: "Doctor's Code",
      isValid: this.isStepValid,
      validate: this.shouldValidate
    }
  ];

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  public form = new FormGroup({
    doctorDetails: new FormGroup({
      university: new FormControl('', [Validators.required,Validators.maxLength(50)]),
      specialty: new FormControl('', [Validators.required]),
      degree: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      note: new FormControl('', [])
    }),
    personalDetails: new FormGroup({
      clinicName: new FormControl('', [Validators.required, ]),
      clinicPhone: new FormControl('', [Validators.required]),
      regularFee: new FormControl('', [Validators.required,RxwebValidators.digit(),this.ValidatorsService.notEqualZero()]),
      urgent : new FormControl('', [RxwebValidators.digit(),this.ValidatorsService.notEqualZero()]),
      cityName: new FormControl('', []),
      cityTo: new FormControl('', []),
      consultation:new FormControl('', [RxwebValidators.digit(),this.ValidatorsService.notEqualZero()]),
      address : new FormControl('', [Validators.required]),
      // flag : new FormControl('', [Validators.required])
    }),
    ConsultationData: new FormGroup({
      homeVisit: new FormControl('', [Validators.required,RxwebValidators.digit(),this.ValidatorsService.notEqualZero()]),
      videoCall: new FormControl('', [Validators.required,RxwebValidators.digit(),this.ValidatorsService.notEqualZero(),this.ValidatorsService.minValueError()]),
      videoFrom: new FormControl('', [Validators.required]),
      videoTo: new FormControl('', [Validators.required]),
    }),
    signature: new FormGroup({
      signatureImage:new FormControl('', [Validators.required])
    }),
    doctorCode: new FormGroup({
      codeOne:new FormControl('', [Validators.required,RxwebValidators.digit() ]),
      codeTwo:new FormControl('', [Validators.required,RxwebValidators.digit() ]),
      codeThree:new FormControl('', [Validators.required,RxwebValidators.digit() ]),
      codeFour:new FormControl('', [Validators.required,RxwebValidators.digit() ])
    }),
  });
  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }


  // get doctor clinics
  getDoctorClinics() {

    this._clinicsService.getDoctorClinis()
    .pipe(
      takeUntil(this._unsubscribeAll)
    )
    .subscribe((res:any) =>{
      // //console.log(res)
      if(res.data.length > 0) {
        this.isClinicRegister = true
      }
      this.doctorClinisData = res.data;
    },(error) =>{
      this._toastrService.error(error.error.errors[0],"error")
    })

  }
  // get doctor clinics





  addStepObject(newItem: any) {
    // this.stepImageFile = newItem;
    //    this.formDataStepOne.append('image', newItem);
    this.stepsObject.stepOne.degre_id = newItem.degre_id;
    this.stepsObject.stepOne.speciality_id = newItem.speciality_id;
    this.stepsObject.stepOne.university = newItem.university;
    this.stepsObject.stepOne.image = newItem.image;
    this.stepsObject.stepOne.consolto = newItem.consolto;
    this.stepsObject.stepOne.note = newItem.note;


    ////console.log("prooooooooooooooooooops 22222222222")
  }
  addStepTwoObject(newItem: any) {
    this.stepsObject.stepTwo = {...newItem};
    ////console.log("step twoooooooooooooo 22222222222", this.stepsObject.stepTwo, newItem)

  }
  addStepThreeObject(newItem: any) {
    this.stepsObject.stepThree = {...newItem};
  }
  addStepFourObject(newItem: any) {
    this.stepsObject.stepFour.signature_image = newItem.signature_image;
  }
  addStepFiveObject(newItem: any) {
    this.stepsObject.stepFive.access_code= newItem.access_code;
  }
  stepTwoNext() {
    // console.log(this.currentStep)
    this.currentStep =   this.currentStep + 1;

  }
  public next(): void {
    
    if(this.currentStep == 2 && !this.currentGroup.valid && this.currentGroup.controls['videoCall'].valid){
      this.submitStepData(this.stepsObject.stepThree, this.currentStep)
    }
  
    if (this.currentGroup.valid && this.currentStep !== this.steps.length) {
        if(this.currentStep == 0) {
          this.submitStepData(this.stepsObject.stepOne, this.currentStep)
        } else if(this.currentStep == 1) {
          this.submitStepData(this.stepsObject.stepTwo, this.currentStep)
        }else if(this.currentStep == 2) {
          this.submitStepData(this.stepsObject.stepThree, this.currentStep)
        }else if(this.currentStep == 3) {
          this.submitStepData(this.stepsObject.stepFour, this.currentStep)
        }

      return;
    }

    this.currentGroup.markAllAsTouched();
    this.stepper?.validateSteps();
  }

  public prev(): void {
    this.currentStep -= 1;
  }

  public submit(): void {
    ////console.log("submit",this.currentStep)
    if (!this.currentGroup.valid) {
      this.currentGroup.markAllAsTouched();
      this.stepper?.validateSteps();
    }
    if (this.form.valid) {
      ////console.log('Submitted data', this.form.value);
    }
    if(this.form.controls.doctorCode.valid) {
      ////console.log('Submitted data', this.form.value);
      //debugger
      if(this.currentStep == 4) {
        this.submitStepData(this.stepsObject.stepFive, this.currentStep)
      }
        // this.router.navigateByUrl('home', { state: this.register });




    }
  }
  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map(groupName => this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._unsubscribeAll.next("");
  }

  firstTimeLogin(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'isAssistant' + '='+ false + ';expires=' + expires + ';path=/';
  }
  
}






