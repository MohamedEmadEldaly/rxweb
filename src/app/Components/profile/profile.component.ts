import { Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import axios from 'types-axios';
import { environment as env, environment } from '../../../environments/environment';
import { ToastService } from 'src/app/core/_services/toast.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  reactiveForm: FormGroup;
  resetPassword: FormGroup;
  resetSignature: FormGroup;
  resetDoctorCode: FormGroup;
  changePhone: FormGroup;
  personalDetails: any;
  ConsultationData: any;
  doctorDetails: any;
  changePasswordObject:any;
  isLoaderShow:boolean = false;
  personalDoctorInfo:any;

  accessCodeForm : FormGroup;
  finalUserPhone!: any;


  // personalDetails: FormGroup;
  constructor(private fb: FormBuilder, 
    public ToastService: ToastService, 
    private modalService: NgbModal, private activatedroute:ActivatedRoute, 
    private router:Router,
    private validatorService : ValidatorsService,
    private toastrService : ToastrService,
    private _authService : AuthenticationService,
    private toasterService : ToastrService,
    ) {

    this.reactiveForm = this.fb.group({
      clinicName: ['', [Validators.required]],
      clinicPhone: ['', [Validators.required]],
      regularFee: ['', [Validators.required]]
    });
    this.resetDoctorCode = this.fb.group({
      resetDoctorCodeValue: ['', [this.noWhitespaceValidator]]
    });
    this.accessCodeForm = new FormGroup({
      codeOne : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeTwo : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeThree : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeFour : new FormControl('',[Validators.required,RxwebValidators.digit()]),
    })

    this.resetPassword = this.fb.group({
      oldPasswordValue: ['', [Validators.required]],
      newPasswordValue: ['', [Validators.required,Validators.minLength(8)]],
      confirmPasswordValue: ['', [Validators.required,Validators.minLength(8)]]
    }, {
      validator: this.ConfirmedValidator('newPasswordValue', 'confirmPasswordValue')
    })

    this.changePhone= new FormGroup({
      doctorPhone: new FormControl('', [Validators.required])
    })

  // formData.append('selected_days', stepObject.selected_days);
    // this.personalDetails = this.fb.group({
    //   clinicName: ['', [Validators.required]],
    //   clinicPhone: ['', [Validators.required]],
    //   regularFee: ['', [Validators.required]]
    // });
    this.doctorDetails= new FormGroup({
      university: new FormControl('', [Validators.required,Validators.maxLength(50)]),
      specialty: new FormControl('', [Validators.required]),
      degree: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required])
    }),

    this.personalDetails= new FormGroup({
      clinicName: new FormControl('', [Validators.required]),
      clinicPhone: new FormControl('', [Validators.required]),
      regularFee: new FormControl('', [Validators.required]),
      // cityName: new FormControl('', []),
      // cityTo: new FormControl('', [])
    })

    // this.ConsultationData= new FormGroup({
    //   homeVisit: new FormControl([Validators.required]),
    //   videoCall: new FormControl([Validators.required]),
    // }),

    this.resetSignature = this.fb.group({
      signatureImage:new FormControl('', [Validators.required])

    });
    this.activatedroute.data.subscribe((data: any) => {
      // ////console.log("daaaaaaaaaaaaaaaata home",this.router.getCurrentNavigation()?.extras.state);
      //debugger
      if(this.router.getCurrentNavigation()?.extras.state != undefined) {
        this.personalDataObject.user = this.router.getCurrentNavigation()?.extras.state?.personalInfo;
        this.phoneNumberBind = this.personalDataObject.user.phone;
        this.finalUserPhone = `${this.personalDataObject.user.country_code.split('')[0]}${this.personalDataObject.user.phone}`
        // this.finalUserPhone = `${this.personalDataObject.user.phone}`
        this.personalDoctorInfo = this.router.getCurrentNavigation()?.extras.state?.personalInfo;
      }
    })
  }




  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  SearchCountryField = SearchCountryField;
  separateDialCode = true;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  signature_layer_preview = false;
  signature_image_file:any;
  apiUrl = environment.apiUrl;
  // @ViewChild('image') image: any;
  @ViewChild('image', {read: TemplateRef}) image: any;
  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.signature_layer_preview = true;
      let file: File = fileList[0];
      this.signature_image_file = fileList[0];
      let img = document.querySelector(".signature--upload img");
      // this.image.file = file;
      var reader = new FileReader();
      reader.onload = (function (aImg: any) { return function (e: any) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }
  // ConfirmedValidator(arg0: string, arg1: string): any {
  //   throw new Error('Method not implemented.');
  // }
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

  onSubmitPassword() {

    // ////console.log("submiiiit", this.resetPassword.controls, this.resetPassword.value);
    // this.resetPassword.value.country_code = 20;
    if (this.resetPassword.status == 'VALID') {
      // this.sendDataRegistered(this.reactiveForm.value)
      this.changePasswordObject = this.resetPassword.value;
      this.passwordChange(this.resetPassword.value)

    } else {
      // this.signupRoute = 'auth/SignUp'
    }


  }

  phoneGroup! : FormGroup;
  contactForm! : FormGroup;


  engNameForm!:FormGroup;
  arNameForm!:FormGroup;


  latestAccessCode : any;
  ngOnInit(): void {
    // $('select').selectmenu('refresh', true);
    this.accessToken = this.getCookieDisclaimer("userToken");


    this.engNameForm = new FormGroup({
      engNameF : new FormControl(this.personalDataObject.user?.en_name,Validators.required)
    })

    this.arNameForm = new FormGroup({
      arNameF : new FormControl(this.personalDataObject.user?.ar_name,Validators.required)
    })

    // this.getUpdatedPersonalInfo();
    // this.getDoctorClinis();
    // this.getConsultoData();
    // //console.log(this.personalDataObject)

    // this.personalDetails.reset({ clinicName: 'name'});
    // this.personalDetails.value.clinicName = "plaaaaaaaaaaaaaaaaaa"
    // ////console.log("this.personalDetails",this.personalDetails.value.clinicName);
    document.querySelector(".doctor-assistant")?.classList.remove("d-none");

    if(!this.personalDataObject.user){
      this.getUpdatedPersonalInfo();
    } else {
      this.phoneGroup = new FormGroup({
        phone : new FormControl(this.personalDataObject.user.phone,[Validators.required]),
        email: new FormControl(this.personalDataObject.user.email, [Validators.required, Validators.email,this.validatorService.emailValidator()]),
      })
    }


    this._authService.getAccessCode()
    .subscribe((res:any)=>{
      this.latestAccessCode = res.data.accessCode;
    },(error) =>{
      // this.toasterService.error(error.error.message)
      this.validatorService.handelError(error)
    })

    this.contactForm = new FormGroup({
      messageArea : new FormControl('',[Validators.required,Validators.minLength(50)]),
    })

  }


  welcomeImage: boolean = true;
  personalInfoShow: boolean = false;
  doctorInfoShow: boolean = false;
  clinicInfoShow: boolean = false;
  consultoShow: boolean = false;
  signatureShow: boolean = false;
  contactUsShow: boolean = false;
  clinicEditShow: boolean = false;
  doctorInfoDetails: boolean= false;
  doctorInfoEdit: boolean = false;
  messageSend: boolean = false;
  consultoDetails: boolean=false;
  registerClinicDetails: boolean = true;
  addClinic: boolean = false;
  consultoEdit: boolean= false;
  isAssistantMode: boolean= false;
  confirmPassword: string = 'password';
  passwordShow: string='password';
  newPassword: string='password';
  // prfileItems: any = ['Personal Info', "Doctor's Data", "Clinic's Data", "Consultation", "Signature & Access Code", "Contact US"]
  prfileItems: any = ['Personal Info', "Doctor's Data", "Clinic's Data", "Consultation", "Signature & Access Code"]

  // @Input() public personalDetails!: FormGroup;
  daties: any = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']
  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild("clinicName") clinicName: any;
  @ViewChild('clinicPhone') clinicPhone: any;
  @ViewChild('from') from: any;
  @ViewChild('to') to: any;
  @ViewChild('currrencyType') currrencyType: any;
  @ViewChild('regularFee') regularFee: any;
  @ViewChild('messageValue') messageValue: any;
  @ViewChild('content') content: any;
  @ViewChild('englishName') englishName: any;
  @ViewChild('arabicName') arabicName: any;
  @ViewChild('phoneNumber') phoneNumber: any;
  @ViewChild('doctorCodeModel') doctorCodeModel: any;
  @ViewChild('email') email: any;
  @ViewChild('doctorCodeOne') doctorCodeOne: any;
  @ViewChild('doctorCodeTwo') doctorCodeTwo: any;
  @ViewChild('doctorCodeThree') doctorCodeThree: any;
  @ViewChild('coddoctorCodeFoureFour') doctorCodeFour: any;
  @ViewChild ('homeVisitfees') homeVisitfees: any;
  @ViewChild ('homeVisitCurrency') homeVisitCurrency:any;
  @ViewChild ('videoCallCurrency') videoCallCurrency: any;
  @ViewChild ('videoFrom') videoFrom: any;
  @ViewChild ('videoCallfees') videoCallfees: any;
  isVideoConsult:boolean= false;
  @ViewChild ('videoTo') videoTo: any;
  public register = { isAssistant: true};


  canNotEnter : boolean = true;

  getConsultoData() {
    // this.isDetailsLoaderShow = true;
    this.isLoaderShow = true;
    axios({
      url: `${this.apiUrl}doctor-video-calls`,
      method: "GET",
      headers: {
        'Authorization': "Bearer "  +this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {


      this.canNotEnter = false;

      // ////console.log("resssoooopse msg consultooooo", res.data.data);
      this.consultoData = res.data.data[res?.data?.data?.length - 1];
      this.editConsultoId = this.consultoData?.id;

      if(!this.consultoData) {
        this.consultoData = {};
        this.consultoData.is_home_visit = 0;
        this.consultoData.is_video_call = 0;
        this.consultoData.video_selected_days = ['Sunday']
      } else{
        if(this.consultoData.is_home_visit == 1){
          this.currentGroup.controls['homeVisit'].setValue(this.consultoData.fees_home_visit);
          this.addValidators()
        } else if (this.consultoData.is_video_call == 1){
          this.addValidators2();
          this.currentGroup.controls['videoCall'].setValue(this.consultoData.fees_video_call)
        }
      }

      // console.log("get")
      // console.log(!this.consultoEdit);
      // if(!this.consultoEdit){
      //   this.consultoDetails = true;
      // }

      this.consultoEdit = false;
      this.isLoaderShow = false;
      this.consultoDetails = true;

      this.isLoaderShow = false;




    // this.isDetailsLoaderShow = false;

    },(error)=>{
    this.isLoaderShow = false;
      this.validatorService.handelError(error)
    })

  }

  consultoData:any ={
    "id": 1,
    "doctor_id": 2,
    "is_home_visit": 0,
    "fees_home_visit": '',
    "is_video_call": 0,
    "fees_video_call": '',
    "video_from": "",
    "video_to": "",
    "video_selected_days": [],
    "available_dates": [],
    "currency": "1",
    "video_call_currency": 1
  }
  show_personal_layer_preview = false;

  personal_image_file:any;

  @ViewChild('imageChange') imageChangeProf: any;

  fileImageChange(e:any){

    // ////console.log("image")
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      this.show_personal_layer_preview = true;
      let file: File = fileList[0];
      this.personal_image_file = fileList[0];
      let img = document.querySelector("#change-image img");
      this.imageChangeProf.file = file;
      var reader = new FileReader();
      reader.onload = (function (aImg: any) { return function (e: any) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
      this.imageProfileChange()
    }

  }
  constructChangeImage(img:any) {
    const formData = new FormData();
    formData.append('image', img);
    return formData;
  }

  changeCookiePersonal(personalFile: any){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userPersonalInfo' + '=' +  JSON.stringify(personalFile) + ';expires=' + expires + ';path=/';

  }

  imageProfileChange() {
    let formData = this.constructChangeImage(this.personal_image_file)
    axios({
      url: `${this.apiUrl}personal-info`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      console.log(res.data.data.user.image)
      this._authService.updateCachedUser("userPhoto",res.data.data.user.image)
      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone;

      this.changeCookiePersonal(this.personalDataObject.user)
      this.showSuccess(res.data.message);

    }).catch(error=>{
      this.validatorService.handelError(error)
    })


  }

  editConsultoId= this.consultoData.id;
  personalDataObject: any = {
    // user: {
    //   "id": 5,
    //   "ar_name": "gerskk",
    //   "en_name": "michaaal",
    //   "country_code": "20",
    //   "phone": "2563478",
    //   "email": "michel.eraasoft@gmail.com",
    //   "speciality_id": "31",
    //   "speciality_en": "Orthopedics (bones) ",
    //   "speciality_ar": "جراحة العظام",
    //   "university": "cairo",
    //   "note": "",
    //   "degre_id": "3",
    //   "degre_en": "General practioner",
    //   "degre_ar": "ممارس عــام",
    //   "image": "/assets/uploads/doctors/2021/06/26/20210626153532823240539_doctors.png",
    //   "signature_image": "/assets/uploads/doctors/2021/06/26/20210626155449921270363_doctors.png",
    //   "access_code": "5555",
    //   "fcm_token": "",
    //   "status": "6",
    //   "consolto": false,
    //   "patient_number": 0

    // }
  }

  editMode:boolean= true;
  accessToken: any;
  closeResult = '';
  englishNameValue: any;
  arabicNameValue: any;
  phoneNumberValue: any;
  emailValue: any;
  currentStep = 1;
  selectedClinicData: any;
  selectedClinicId:any;
  clinicsData: any;
  changeEditMode:boolean= true;
  changeStepOneMode:boolean= true;
  editClinic:boolean = false;
  showDocotorEditMode(){
    this.doctorInfoDetails = false;
    this.doctorInfoEdit = true;
  }

  data={
    "id": 2,
    "ar_name": "احمد",
    "en_name": "ahmed",
    "country_code": "20",
    "phone": "01020845677",
    "email": "ahmed@rx50.com",
    "speciality_id": "43",
    "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
    "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
    "university": "cairo",
    "note": "",
    "degre_id": "2",
    "degre_en": "specailist",
    "degre_ar": "أخصائي",
    "image": "/assets/uploads/doctors/2021/07/02/20210702192625834432401_doctors.jpeg",
    "signature_image": "/assets/uploads/doctors/2021/07/02/202107021927022049051277_doctors.jpg",
    "access_code": "1111",
    "fcm_token": "d7sjR-r3RwG5ZlUnySq_6g:APA91bFqKzA3TuDos7RdHnGi-wfEiqOS1Fqyuoe9do12HYXyyeEqJAeIUw-81COFNuCyFPzbEBi3xCB5CEQWU-Ay8wLk4-3eyWlLcFADNG_yokmh0BxEGXFv_xoLD0T2IAGcPT-uU3CP",
    "status": "6",
    "consolto": true,
    "patient_number": 2
  }

  generateimageUrl(url: any) {
    let genUrl = environment.assetUrl + url
    return genUrl;
  }
  showConfirmPassword(): void {
    if (this.confirmPassword == 'text') {
      this.confirmPassword = 'password'
    } else {
      this.confirmPassword = 'text'
    }
  }
  showPassword(): void {
    if (this.passwordShow == 'text') {
      this.passwordShow = 'password'
    } else {
      this.passwordShow = 'text'
    }
  }
  shownewPassword(): void {
    if (this.newPassword == 'text') {
      this.newPassword = 'password'
    } else {
      this.newPassword = 'text'

    }

  }

  getUpdatedPersonalInfo() {
    if(!this.personalDataObject.user){
      axios({
        url: `${this.apiUrl}personal_data`,
        method: "GET",
        headers: {
          'Authorization': "Bearer " + this.accessToken,
          'Accept-Language': "en"
        },
      }).then((res) => {
        //debugger
        ////console.log(res)
        this.personalDataObject.user = res.data.data
        this.personalDoctorInfo = res.data.data;
        this.phoneNumberBind = this.personalDataObject.user.phone
  
        this.changeCookiePersonal(res.data.data)
        // let date = new Date();
        // date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        // let expires = "; expires=" + date.toLocaleString();
        // document.cookie = 'userPersonalInfo' + '=' +  JSON.stringify(res.data.data) + ';expires=' + expires + ';path=/';
        this.finalUserPhone = `${this.personalDataObject.user.country_code.split('')[0]}${this.personalDataObject.user.phone}`;
        // this.finalUserPhone = `${this.personalDataObject.user.phone}`;


        // console.log(this.personalDataObject.user)

        this.phoneGroup = new FormGroup({
          phone : new FormControl(this.personalDataObject.user.phone,[Validators.required]),
          email: new FormControl(this.personalDataObject.user.email, [Validators.required, Validators.email,this.validatorService.emailValidator()]),
        })
  
      }).catch(error=>{
        this.validatorService.handelError(error);
      })
    }
   
  }

  currencyType(currecyId:any) {
    if(currecyId == 1) {
      return 'EGP'
    } else if(currecyId == 2) {
      return 'US'
    } else {
      return 'EUR'
    }
  }

  showAddNewClinic(){
    this.registerClinicDetails = false;
    this.addClinic= true;
  }
  
  showEditClinic() {

    // this.personalDetails.patchValue({clinicName: 'Nancy'});
    // this.personalDetails.reset({ clinicName: 'name' });
    this.registerClinicDetails = false;
    this.addClinic = false;
    this.editClinic= true;
    // this.form.personalDetails.patchValue({clinicName: 'Nancy'});
    // this.personalDetails.value.clinicName = "plaaaaaaaaaaaaaaaaaa"
    // this.personalDetails.patchValue({clinicName: 'Nancy'});
    // this.personalDetails.reset({ clinicName: 'name' });

  }



  public form = new FormGroup({
    doctorDetails: new FormGroup({
      university: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      specialty: new FormControl('', [Validators.required]),
      degree: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      note: new FormControl('', [])
    }),
    personalDetails: new FormGroup({
      clinicName: new FormControl('', [Validators.required]),
      clinicPhone: new FormControl('', [Validators.required]),
      regularFee: new FormControl('', [Validators.required])
    }),
    ConsultationData: new FormGroup({
      homeVisit: new FormControl('',[RxwebValidators.digit(),this.validatorService.notEqualZero()]),
      videoCall: new FormControl('',[RxwebValidators.digit(),this.validatorService.notEqualZero()]),
      videoFrom: new FormControl('', [Validators.required]),
      videoTo: new FormControl('', [Validators.required]),
    }),
    signature: new FormGroup({
      signatureImage: new FormControl('', [Validators.required])
    }),
    doctorCode: new FormGroup({
      codeOne: new FormControl('', [Validators.required]),
      codeTwo: new FormControl('', [Validators.required]),
      codeThree: new FormControl('', [Validators.required]),
      codeFour: new FormControl('', [Validators.required])
    }),
  });

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index)?.touched && this.currentStep >= index;
  };

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
  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }
  markedAllTouched:boolean = false;
  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map(groupName => this.form.get(groupName)
    ) as FormGroup[];
    return groups[index];
  }
  onlyUnique(value:any, index:any, self:any) {
    return self.indexOf(value) === index;
  }

  public addNewClinic(): void {

    // console.log(this.currentGroup.valid);
    // console.log(this.currentGroup.value);
    // console.log(this.editMode);
    // if(this.editMode && !this.currentGroup.valid){
    //   if(this.currentGroup.value['clinicName'] === '' && this.currentGroup.value['clinicPhone'] === '' && this.currentGroup.value['regularFee'] === ''){
    //     this.editClinic = false;
    //     this.registerClinicDetails = true;
    //   }

    // }



    //console.log("edit mode",this.editMode);
    // console.log("addNewClinic",this.stepsObject.stepTwo)

    if (this.currentGroup.valid) {
      //console.log("this.currentGroup.valid",)
      this.submitStepData(this.stepsObject.stepTwo, 2)

      // ////console.log("insiiiiiide")
      return;
    }
    if(this.isEditFormValid) {
      //console.log("isEditFormValid")
      this.submitStepData(this.stepsObject.stepTwo, 2)
    }
    // this.addressForm.markAsTouched()
    this.markedAllTouched = !this.markedAllTouched;
    this.currentGroup.markAllAsTouched();
  }

  public addNewConsulto(): void {
    //debugger
    // ////console.log("form value ", this.form, this.stepsObject.stepOne)
    if (this.currentGroup.valid) {
      this.submitStepDataThree(this.stepsObject.stepThree, this.currentStep)
      // ////console.log("insiiiiiide")
      return;
    }
    this.currentGroup.markAllAsTouched();
  }
  public editDoctorData(): void {

    // ////console.log("form value ", this.form, this.stepsObject.stepOne)

    if (this.currentGroup.controls.degree.status == 'VALID' && this.currentGroup.controls.specialty.status == 'VALID' && this.currentGroup.controls.university.status == 'VALID' ) {
      this.submitStepDataOne(this.stepsObject.stepOne, this.currentStep)
    }
    this.currentGroup.markAllAsTouched();
  }

  public stepsObject = {
    stepOne: {
      // image: '',
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
  
  getDoctorClinis() {
    this.isDetailsLoaderShow = true;
    axios({
      url: `https://rx-egy.com/api/v2/doctor_clinics`,
      method: "GET",
      headers: {
        'Authorization': "Bearer "  +this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {

      // ////console.log("resssoooopse msg clinics", res.data.data);
      this.clinicsData = res.data.data;
      this.selectedClinicData = this.clinicsData[0];
      //console.log("first step selected",this.selectedClinicData)
      this.isDetailsLoaderShow = false;
      // //console.log(this.selectedClinicData)
      this.selectedClinicId = this.selectedClinicData.id;
      this.registerClinicDetails = true;
      this.addClinic = false;
      this.editClinic = false;
    }).catch(error=>{
      this.validatorService.handelError(error)
    })

  }
  currentItem = 'Television';
  changeEnglishName: boolean = false;
  changePhoneNumber: boolean = false;
  changeDoctorCode:boolean = false;
  doctorCodeValue: any;
  changeArabicName: boolean = false;
  changeEmail: boolean = false;


  addStepTwoObject(newItem: any) {

    

    // console.log("newItem",newItem)
    //debugger
    this.isEditFormValid = newItem.isFormValid;
    //console.log("new item",newItem)
    this.stepsObject.stepTwo = { ...newItem };

    // ////console.log("step twoooooooooooooo 22222222222", this.stepsObject.stepTwo, newItem)

  }
  isEditFormValid:boolean = false;
  isFormValid(item: any) {
    //debugger
    this.isEditFormValid = item.isFormValid;
    var prop = "reisFormValidgex";
    // delete this.stepsObject.stepTwo[prop];
    // delete this.stepsObject.stepTwo['isFormValid'];
  }
  addStepOneObject(newItem: any) {
    // this.stepImageFile = newItem;
    //    this.formDataStepOne.append('image', newItem);
    this.stepsObject.stepOne.degre_id = newItem.degre_id;
    this.stepsObject.stepOne.speciality_id = newItem.speciality_id;
    this.stepsObject.stepOne.university = newItem.university;
    // this.stepsObject.stepOne.image = newItem.image;
    this.stepsObject.stepOne.consolto = newItem.consolto;
    this.stepsObject.stepOne.note = newItem.note;
  }
  constructStepOneObject(stepObject: any) {
    const formData = new FormData();
    // formData.append('image', stepObject.image);
    formData.append('speciality_id', stepObject.speciality_id);
    formData.append('degre_id', stepObject.degre_id);
    formData.append('university', stepObject.university);
    formData.append('consolto', stepObject.consolto);
    formData.append('note', stepObject.note);

    return formData;
  }

  addStepThreeObject(newItem: any) {
    this.stepsObject.stepThree = {...newItem};
  }

  editModeFlag(newItem: any) {
    this.stepsObject.stepTwo = { ...newItem };
    // ////console.log("step twoooooooooooooo 22222222222", this.stepsObject.stepTwo, newItem)

  }
  @Input() public personalDataObjectHome:any;

  isDetailsLoaderShow: boolean = false;

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


    formData.append('is_video_call', stepObject.is_video_call);
    formData.append('is_home_visit', stepObject.is_home_visit);
    formData.append('doctor_video_call_id', this.editConsultoId)

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
  showClickSelectedDetails(e: any) {
    this.selectedClinicData = this.clinicsData[e.target.selectedIndex];
    //console.log("selected",this.selectedClinicData)
    this.selectedClinicId = this.selectedClinicData.id;
    // console.log(this.selectedClinicData)
  }

  isAddClinicFinish:boolean = false;

  submitStepData(stepObject: any, curentStep: any) {
    if(stepObject.selected_days.length > 0){
      this.isLoaderShow = true;
      //console.log(stepObject)
      let formData, url;
      formData = this.constructStepTwoObject(stepObject);
      url = `https://rx-egy.com/api/v2/clinicData`
      axios({
        url: url,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + this.accessToken,
        },
      }).then((res) => {
  
        // ////console.log("resssoooopse msg", res.data);
        this.isLoaderShow = false;
        this.isAddClinicFinish = !this.isAddClinicFinish;
        this.getDoctorClinis()
  
      }).catch((error) => {
        this.showSuccess(error.response.data.errors[0]);
         this.isLoaderShow = false;
  
        // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
      });
    } else {
      this.showSuccess("إدخال مواعيد العمل!");
    }
  }

  submitStepDataThree(stepObject: any, curentStep: any) {
    this.isLoaderShow = true;
    let formData, url;
    formData = this.constructStepThreeObject(stepObject);
    url = `${this.apiUrl}doctor-consultation`
    axios({
      url: url,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,
      },
    }).then((res) => {
      // ////console.log("resssoooopse msg", res.data);

      this.consultoEdit = false;
      this.consultoDetails = true;
      this.isLoaderShow = false;

      this.getConsultoData();



    }).catch((error) => {
      this.showSuccess(error.response.data.errors[0]);
      this.isLoaderShow = false;

      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });
  }

  submitStepDataOne(stepObject: any, curentStep: any) {

    this.isLoaderShow = true;
    let formData, url;
    formData = this.constructStepOneObject(stepObject);
    url = `${this.apiUrl}update-doctor-data`
    axios({
      url: url,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer "+this.accessToken,
      },
    }).then((res)=> {
      // ////console.log("submitStepDataOne", res.data.data)
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.phoneNumberBind = this.personalDataObject.user.phone

      //debugger
      this.changeCookiePersonal(this.personalDataObject.user)

      this.personalDoctorInfo = res.data.data.user;
      this.doctorInfoDetails = true;
      this.doctorInfoEdit = false;
      this.isLoaderShow = false;
    }).catch((error) => {
      this.isLoaderShow = false;
      this.validatorService.handelError(error)
      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });

  }

  isConsoltoParticipate:boolean=false;
  onChange(deviceValue: any) {
    let indexOptionSelected: number =  Number(document.querySelector(`option[value ='${deviceValue.target.value}']`)?.getAttribute('id'))
    if (indexOptionSelected == 0) {

     this.isConsoltoParticipate = true

    }else {
      this.isConsoltoParticipate = false
    }
    // document.querySelector('`option[${deviceValue.target}]`')
  }
  // constructStepTwoObject(stepObject: any) {

  //   // const formData = new FormData();
  // //   let formData ={
  // //     name: stepObject.name,
  // //   phone: stepObject.phone,
  // //   from: stepObject.from,
  // //   to: stepObject.to,
  // //   lat: stepObject.lat,
  // //   lng: stepObject.lng,
  // //   address: stepObject.address,
  // //   currency: stepObject.currency,
  // //  fees_regular: stepObject.fees_regular,
  // //  fees_recheck: stepObject.fees_recheck,
  // //   fees_urgent:stepObject.fees_urgent,
  // //   selected_days:stepObject.selected_days,

  // //   clinic_id: this.selectedClinicId


  // //   }
  // //   if(this.addClinic){
  // //     formData.clinic_id =''
  // //   }

  //   // formData.append('name', stepObject.name);
  //   // formData.append('phone', stepObject.phone);
  //   // formData.append('from', stepObject.from);
  //   // formData.append('to', stepObject.to);
  //   // formData.append('lat', stepObject.lat);
  //   // formData.append('lng', stepObject.lng);
  //   // formData.append('address', stepObject.address);
  //   // formData.append('currency', stepObject.currency);
  //   // formData.append('fees_regular', stepObject.fees_regular);
  //   // formData.append('fees_recheck', stepObject.fees_recheck);
  //   // formData.append('fees_urgent', stepObject.fees_urgent);
  //   // formData.append('country_code', stepObject.country_code);

  //   // formData.append('selected_days[]', stepObject.selected_days);


  //   if(this.editClinic == true) {
  //      formData.append('clinic_id', this.selectedClinicId);
  //   }

  //   //debugger
  //   let unique = (src:any) => [...new Set(src)];
  //   stepObject.selected_days = unique( stepObject.selected_days)
  //   // stepObject.selected_days = stepObject.selected_days.filter((item:any, index:any) =>  stepObject.selected_days.indexOf(item)== index);
  //   // this.selected_days = this.selected_days.filter((item:any, index:any)=> this.selected_days.indexOf(item)== index);
  //   stepObject.selected_days.forEach(function (ele: any, i: number) {
  //      formData.append(`selected_days[${i}]`, ele);

  //     // value.selected_days[i] = ele
  //   })

  //   return formData;
  // }

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
    delete stepObject.isFormValid

    stepObject.clinic_id = "";


    if(this.editClinic == true) {
      stepObject['clinic_id'] = this.selectedClinicId;
    }




    // return formData;
    // console.log(stepObject)
    return stepObject;
  }


  selectedItem: any;
  // lat = 51.678418;
  // lng = 7.809007;
  isHomeVisit:boolean= false;

  changeConsultoEdit() {
    if(this.consultoData.is_home_visit == 0){
      this.removeValidators()
      this.currentGroup.controls['homeVisit'].setValue('');
    }
    if(this.consultoData.is_video_call == 0){
      this.removeValidators2()
      this.currentGroup.controls['videoCall'].setValue('');
    }
    // console.log("hello")
    // console.log(this.isHomeVisit)
    this.consultoDetails = false;
    this.consultoEdit = true;

  }

  removeValidators(){
    this.currentGroup?.controls['homeVisit'].setValidators([]);;
    this.currentGroup?.controls['homeVisit'].updateValueAndValidity();
  }

  addValidators2(){
    this.currentGroup?.controls['videoCall'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero()]);
        this.currentGroup?.controls['videoCall'].updateValueAndValidity();
        this.currentGroup?.controls['videoFrom'].setValidators([Validators.required]);
        this.currentGroup?.controls['videoFrom'].updateValueAndValidity();
        this.currentGroup?.controls['videoTo'].setValidators([Validators.required]);
        this.currentGroup?.controls['videoTo'].updateValueAndValidity();
  }

  addValidators(){
  this.currentGroup?.controls['homeVisit'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero()]);
        this.currentGroup?.controls['homeVisit'].updateValueAndValidity();
  }

  removeValidators2(){
    this.currentGroup?.controls['videoCall'].setValidators([]);
    this.currentGroup?.controls['videoCall'].updateValueAndValidity();
    this.currentGroup?.controls['videoFrom'].setValidators([]);;
    this.currentGroup?.controls['videoFrom'].updateValueAndValidity();
    this.currentGroup?.controls['videoTo'].setValidators([]);;
    this.currentGroup?.controls['videoTo'].updateValueAndValidity();
  }

  stepTwoObject = {
    name: '',
    phone: 0,
    lat: '',
    lng: '',
    address: '',
    currency: 1,
    from: '12:00 am',
    to: '12:00 am',
    selected_days: ['Saturday'],
    fees_regular: 100,
    clinic_id: 1

  }
  selected_days: Array<string> = ['Sunday']
  open(content: any) {

    this.engNameForm.patchValue({engNameF:this.personalDataObject.user.en_name})
    this.arNameForm.patchValue({arNameF:this.personalDataObject.user.ar_name})


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  getCookieDisclaimer(cookiesName: any) {
    let name = cookiesName + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  addNewItem(value: any) {
    let clinicCurrencyType = this.currrencyType.nativeElement.value;
    if (clinicCurrencyType == 'EGP') {
      value.currency = 1;
    } else if (clinicCurrencyType == 'US') {
      value.currency = 2;
    } else {
      value.currency = 3
    }
    value.name = this.clinicName.nativeElement.value;
    value.phone = this.clinicPhone.nativeElement.value;
    value.lat = this.lat;
    value.lng = this.lng;
    value.address = this.personalDetails.value['adress']

    value.from = this.from.nativeElement.value.toLowerCase();
    value.to = this.to.nativeElement.value.toLowerCase();
    this.selected_days.forEach((ele, i) => {
      value.selected_days[i] = ele
    })
    value.fees_regular = this.regularFee.nativeElement.value;
    value.clinic_id = 1;
    //console.log(value)
    this.newItemEvent.emit({ ...value });
  }
  addDay(e: any) {

    if (e.target.classList[1] == undefined) {
      e.target.classList.add('active')
      this.selected_days.push(e.target.dataset.value);
    } else {
      if (this.selected_days.length > 1) {
        let itemRemovedIndex = this.selected_days.indexOf(e.target.dataset.value);
        if (itemRemovedIndex != -1) {
          this.selected_days.splice(itemRemovedIndex, 1)
        }
        e.target.classList.remove('active')
      }
    }
  }
  profileInfoClick(itemId: any, item: any) {0

    // ////console.log(itemId)
    this.selectedItem = item;

    if (itemId == 0) {

      this.getUpdatedPersonalInfo();
      this.welcomeImage = false;
      this.personalInfoShow = true;
      this.doctorInfoShow = false;
      this.clinicInfoShow = false;
      this.doctorInfoDetails = false;

      this.consultoShow = false;
      this.signatureShow = false;
      this.contactUsShow = false;
    } else if (itemId == 1) {
      this.getUpdatedPersonalInfo();
      this.welcomeImage = false;
      this.personalInfoShow = false;
      this.doctorInfoShow = true;
      this.currentStep = 0;

      this.doctorInfoDetails = true;
      this.doctorInfoEdit= false;
      this.clinicInfoShow = false;
      this.consultoShow = false;
      this.signatureShow = false;
      this.contactUsShow = false;
    } else if (itemId == 2) {
      this.getDoctorClinis();
      this.welcomeImage = false;
      this.personalInfoShow = false;
      this.doctorInfoShow = false;
      this.clinicInfoShow = true;
      this.currentStep = 1;
      this.registerClinicDetails = true;
      this.editClinic = false;
      this.addClinic = false;
      this.consultoShow = false;
      this.signatureShow = false;
      this.contactUsShow = false;
    } else if (itemId == 3) {

      this.getConsultoData();
      this.canNotEnter = true;
      this.welcomeImage = false;
      this.personalInfoShow = false;
      this.doctorInfoShow = false;
      this.clinicInfoShow = false;
      this.consultoShow = true;
      this.consultoDetails =true;
      this.currentStep = 2;
      this.consultoEdit = false;
      this.signatureShow = false;
      this.contactUsShow = false;

    } else if (itemId == 4) {
      this.getUpdatedPersonalInfo();
      this.welcomeImage = false;
      this.personalInfoShow = false;
      this.doctorInfoShow = false;
      this.clinicInfoShow = false;
      this.consultoShow = false;
      this.signatureShow = true;
      this.contactUsShow = false;
    } else if (itemId == 5) {
      this.welcomeImage = false;
      this.personalInfoShow = false;
      this.doctorInfoShow = false;
      this.clinicInfoShow = false;
      this.consultoShow = false;
      this.signatureShow = false;
      this.contactUsShow = true;
    }

  }
  changeText() {
    if (this.messageValue.nativeElement.value.trim() != '') {
      this.messageSend = true
    } else {
      this.messageSend = false

    }

  }

  changeDoctorCodeText(){
    // inputs.forEach((ele)=> {
    //   ////console.log("vallllllue", ele, ele )
    // })
   let codeOne = (document.getElementById("codeOne") as HTMLInputElement).value
   let codeTwo = (document.getElementById("codeTwo") as HTMLInputElement).value
   let codeThree = (document.getElementById("codeThree") as HTMLInputElement).value
   let codeFour = (document.getElementById("codeFour") as HTMLInputElement).value

   if(codeOne.trim() != '' && codeTwo.trim() != '' && codeThree.trim() != '' && codeFour.trim() != '') {
     this.changeDoctorCode = true;
     this.doctorCodeValue = codeOne+ codeTwo + codeThree + codeFour

   } else {
    this.changeDoctorCode = false;
   }

  }


  arabicNameText(e: any) {
    let isArabic = true;
    //debugger
    if (e.target.value !== this.personalDataObject.user.ar_name && isArabic) {
      this.changeArabicName = true;
      // console.log(e.target.value)
      this.arabicNameValue = e.target.value;
    } else {
      this.changeArabicName = false

    }
  }
  englishNameText(e: any) {
    // let isُEnglish = (/[A-Za-z0-9]/i.test( e.target.value));
    let isُEnglish = true;
     //debugger
    if (e.target.value != this.personalDataObject.user.en_name && isُEnglish ) {
      this.changeEnglishName = true;
      this.englishNameValue = e.target.value;
    } else {
      this.changeEnglishName = false

    }
  }


  noSpacesEvent($event : any){
    this.validatorService.noSpacesEvent($event);
  }

  phoneNumberText(e: any) {

    if (e.target.value != this.personalDataObject.user.phone && e.target.value.trim() !='') {
      this.changePhoneNumber = true;
      this.phoneNumberValue = e.target.value;
    } else {
      this.changePhoneNumber = false

    }
  }
  emailText(e: any) {
    if (e.target.value != this.personalDataObject.user.email && e.target.value.trim() != '') {
      this.changeEmail = true;
      this.emailValue = e.target.value;
    } else {
      this.changeEmail = false
    }
  }

  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }

  sendMessage() {
    this.isLoaderShow = true;

    let message = { message: this.messageValue.nativeElement.value }
    const formData = new FormData();
    formData.append('message', message.message);
    axios({
      url: `${this.apiUrl}doctor-contact-us`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.messageValue.nativeElement.value = ''
      // this.showSuccess(res.data.message);
      this.toastrService.success(res.data.message,"success")
      this.isLoaderShow = false;
      this.contactForm.reset();

    })
    .catch(error =>{
        this.validatorService.handelError(error)
        this.isLoaderShow = false;
    })

  }
  phoneNumberBind: any= '';

  englishNameChange() {
    axios({
      url: `${this.apiUrl}personal-info`,
      method: "POST",
      data: { en_name: this.englishNameValue },
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {

      this._authService.updateCachedUser("userName",this.englishNameValue)
      // ////console.log("personalDataObject", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.phoneNumberBind = this.personalDataObject.user.phone;
      //debugger
      this.personalDoctorInfo = res.data.data.user;
      this.changeCookiePersonal(this.personalDataObject.user)
      this.showSuccess(res.data.message);

    })
    .catch(error=>{
      this.validatorService.handelError(error)
    })


  }
  arabicNameChange() {
    
    // const expression = new RegExp("[\u0621-\u064A\u0660-\u0669]+( +[\u0621-\u064A\u0660-\u0669]+)*")
    // if(expression.test(this.arabicNameValue)){
    //   console.log("valid")
    // }

    axios({
      url: `${this.apiUrl}personal-info`,
      method: "POST",
      data: { ar_name: this.arabicNameValue },
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      //debugger
      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user)
      this.showSuccess(res.data.message);

    })
    .catch(error=>{
      this.validatorService.handelError(error)
    })


  }
  phoneNumberChange() {
    this.isLoaderShow = true;

    axios({
      url: `${this.apiUrl}personal-info`,
      method: "POST",
      data: { phone: this.phoneNumberValue },
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {

      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.finalUserPhone = `${res.data.data.user.country_code.split('')[0]}${res.data.data.user.phone}`
      // this.finalUserPhone = `${res.data.data.user.phone}`
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user)
      this.toastrService.success(res.data.message);


      this.isLoaderShow = false;

    })
    .catch(error=>{
      this.validatorService.handelError(error)
    })


  }

  // dcotorCodeChange() {

  //   axios({
  //     url: `${this.apiUrl}update-signature-code`,
  //     method: "POST",
  //     data: { access_code: this.doctorCodeValue },
  //     headers: {
  //       'Authorization': "Bearer " + this.accessToken,

  //     },
  //   }).then((res) => {

  //     // ////console.log("reeeeeeeeeeeeeeeee", res);
  //     this.personalDataObject = {};
  //     this.personalDataObject = res.data.data;
  //     this.personalDoctorInfo = res.data.data.user;
  //     this.phoneNumberBind = this.personalDataObject.user.phone
  //     this.changeCookiePersonal(this.personalDataObject.user)
  //     this.showSuccess(res.data.message);

  //   })


  // }

  emailChange() {
    this.isLoaderShow = true;
    axios({
      url: `${this.apiUrl}updateEmail`,
      method: "POST",
      data: { email: this.emailValue },
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {

      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user);
      this.toastrService.success(res.data.message,"success");
      this.logOut();
      this.isLoaderShow = false;


    },(error)=>{
      this.validatorService.handelError(error)
      this.isLoaderShow = false;
    })


  }


  logOut(){
    //
    this.removeAllCookiesData()
    // href="/auth/SignIn"

    this.router.navigateByUrl('/auth');

  }

  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';

  }


  passwordChange(passObj: any) {

    this.isLoaderShow = true;

    let newPassword = {
      password: passObj.newPasswordValue,
      password_confirmation: passObj.confirmPasswordValue,
      old_password: passObj.oldPasswordValue
    }
    axios({
      url: `${this.apiUrl}updatePassword`,
      method: "POST",
      data: newPassword,
      headers: {
        'Authorization': "Bearer " + this.accessToken,
      },
    }).then((res) => {
      this._authService.updateCachedUser('password',passObj.newPasswordValue)
      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user)
      // this.showSuccess(res.data.message);
      this.toasterService.success(res.data.message,"success");
      this.resetPassword.reset();
      this.isLoaderShow = false;
    })
    .catch((error) => {
      // console.log(error.message)
      this.validatorService.handelError(error)
      this.isLoaderShow = false;
    })


  }
  
  imageChange(e: any){

    // ////console.log("chaaaaaaaaange", e.target)
  }
  onSubmitSignature() {
    const formData = new FormData();
    formData.append('signature_image',  this.signature_image_file);
    axios({
      url: `${this.apiUrl}update-signature-code`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {

      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user)
      this.showSuccess(res.data.message);

    })
    .catch(error=>{
      this.validatorService.handelError(error);
    })

  }


  lat : any;
  lng : any;
  marker : boolean = false;

  getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
        this.lat = +position.coords.latitude;
        this.lng = +position.coords.longitude;
        this.marker = true;
      }
      })
    }
  
  }



  allowOnlyEnglish($event : any){
    this.validatorService.allowOnlyEnglish($event)
  }

  allowOnlyNumber($event : any){
    this.validatorService.allowOnlyNumber($event)
  }


  allowOnlyArabic($event : any){
    this.validatorService.allowOnlyArabic($event)
  }


  enterCode(){
    const  userCode = this.accessCodeForm.value['codeOne'] + this.accessCodeForm.value['codeTwo'] + this.accessCodeForm.value['codeThree'] + this.accessCodeForm.value['codeFour'];
    this.doctorCodeValue = userCode;

    axios({
      url: `${this.apiUrl}update-signature-code`,
      method: "POST",
      data: { access_code: this.doctorCodeValue },
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {

      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.personalDataObject = {};
      this.personalDataObject = res.data.data;
      this.personalDoctorInfo = res.data.data.user;
      this.phoneNumberBind = this.personalDataObject.user.phone
      this.changeCookiePersonal(this.personalDataObject.user)
      this.showSuccess(res.data.message);
      this.accessCodeForm.reset();

    })
    .catch(error=>{
      this.validatorService.handelError(error);
    })


    // if (userCode === this.personalInfo.access_code) {
    //   this.changedoctorCode = true;
    // } else {
    //   this.changedoctorCode = false;

    // }
  }

  changedoctorCode : any;

  // open(content: any, appoitIndex:any) {
  //   //debugger
  //   // this.selectedDeletedAppointment =  appoitIndex;
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  doctorAssistant() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'isAssistant' + '='+ true + ';expires=' + expires + ';path=/';
    // this.router.navigateByUrl('Home/Patients');
    this.isAssistantMode= true;
    // this.selected = 'Patients';
    // this.isAssistantMode= true;

    this.changedoctorCode = false;
    this.router.navigateByUrl('Home');

  }




}
