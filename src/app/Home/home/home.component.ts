import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { LayoutService } from 'src/app/core/_services/layout.service';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
import { environment } from 'src/environments/environment';
import axios from 'types-axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  accessToken: any;
  route: any;
  @ViewChild('doctorCode') doctorCode: any;
  personalInfo:any=  {
      "id": 5,
      "ar_name": "gerskk",
      "en_name": "michaaal",
      "country_code": "20",
      "phone": "2563478",
      "email": "michel.eraasoft@gmail.com",
      "speciality_id": "31",
      "speciality_en": "Orthopedics (bones) ",
      "speciality_ar": "جراحة العظام",
      "university": "cairo",
      "note": "",
      "degre_id": "3",
      "degre_en": "General practioner",
      "degre_ar": "ممارس عــام",
      "image": "/assets/uploads/doctors/2021/06/26/20210626153532823240539_doctors.png",
      "signature_image": "/assets/uploads/doctors/2021/06/26/20210626155449921270363_doctors.png",
      "access_code": "5555",
      "fcm_token": "",
      "status": "6",
      "consolto": false,
      "patient_number": 0
  }


  accessCodeForm! : FormGroup;

  public register = { registerStepNum:'0', token:"", personalInfo:{}};
  constructor( private modalService: NgbModal, private activatedroute:ActivatedRoute, 
    private validatorService : ValidatorsService,
    private toasterService : ToastrService,
    private router:Router,
    private validatorsService : ValidatorsService,
    private _authService : AuthenticationService,
    private layoutService : LayoutService

    ) {
    this.activatedroute.data.subscribe((data: any) => {
      // //console.log("daaaaaaaaaaaaaaaata home",this.router.getCurrentNavigation()?.extras.state);
      // if(this.router.getCurrentNavigation()?.extras.state != undefined) {
      //   this.register.token =this.router.getCurrentNavigation()?.extras.state?.token;
      //   this.register.personalInfo =this.router.getCurrentNavigation()?.extras.state?.personalInfo;
      //   this.personalInfo =this.router.getCurrentNavigation()?.extras.state?.personalInfo;

      // } else {
      //   this.router.navigateByUrl('auth/SignIn');

      // }
      // //console.log("daaaaaaaaaaaaaaaata", data, this.product)
    })
    router.events.subscribe((val) => {
      // see also
      let urlArry= window.location.href.split('/');
      let lastItemIndex = urlArry.length-1
      if(urlArry[lastItemIndex] == 'Prescriptions') {

        this.selected = 'appointments'

      }
      return false
      // //console.log(val instanceof NavigationEnd, )

    });

    router.events.subscribe((val) => {
      // see also
      let isRoute = val instanceof NavigationEnd
      // //console.log("isRoute", isRoute);
      if(isRoute) {
        let href = window.location.href.split("/");
        let page = href[href.length-1]
        // //console.log(href, page);
        this.selected = page
      }
    });

  }


  latestAccessCode : any;

  sideMenu$ = this.layoutService.menuFlag;

  ngOnInit(): void {
    document.querySelector("body")?.classList.add("gray-background");
    this.getAllDataFromCookies();
    // this.getUpdatedPersonalInfo();
    this._authService.accessToken = this.getCookieDisclaimer("userToken")

    this.getLatestAccessCode();


    this.isAssistantMode = this.getCookieDisclaimer("isAssistant") === 'true' || this.getCookieDisclaimer("isAssistant") === '' ? true : false;

    this.accessCodeForm = new FormGroup({
      codeOne : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeTwo : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeThree : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeFour : new FormControl('',[Validators.required,RxwebValidators.digit()]),
    })


  }


  openMenu(){
    this.layoutService.menuFlag.next(true);
  }

  closeMenu(){
    this.layoutService.menuFlag.next(false);
  }

  getLatestAccessCode(){
    this._authService.getAccessCode()
    .subscribe((res:any)=>{
      this.latestAccessCode = res.data.accessCode;
    },(error) =>{
      this.toasterService.error(error.error.message)
    })  
  }

  hashChange() {
    //
  //  //console.log("channnnnge")
  }
  @ViewChild("appointments") appointments: any;
  @ViewChild("Patients") Patients: any;
  selected:any='Patients';
  // select(item: any) {
  //   this.selected = item;
  // };
  allowNavigation= true;
  canDeactivate() {
    return this.allowNavigation;
  }
  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';
    document.cookie = 'isAssistant' + '=' +  true + ';expires=' + expires + ';path=/';
  }

  enterCode(){
    const  userCode = this.accessCodeForm.value['codeOne'] + this.accessCodeForm.value['codeTwo'] + this.accessCodeForm.value['codeThree'] + this.accessCodeForm.value['codeFour'];
    this.doctorCodeValue = userCode;

    if (userCode === this.latestAccessCode) {
      this.changedoctorCode = true;
      this.accessCodeForm.reset();
    } else {
      this.changedoctorCode = false;
      this.toasterService.error("Wrong access Code","Error");
      this.accessCodeForm.reset();
    }
  }



  logOut(){
    //
    this.removeAllCookiesData()
    // href="/auth/SignIn"

    this.router.navigateByUrl('/auth');

  }
  
  CancelLogOut() {

  }
  // attributeCondition= true;
  isAssistantMode!: boolean;
  clickItem:any;
  selectProfile(e: any, ele: any){
    e.stopPropagation();
    //
    if(ele == 'Patients' || ele == 'Notifications' ) {
      this.selected = ele;
      this.router.navigateByUrl(`Home/${ele}`, { state: this.register });

    } else if(ele === "Appointments") {
      this.router.navigateByUrl(`Home/${ele}`, { state: this.register });
      
    } else if(ele === "Contact") {
      this.router.navigateByUrl(`Home/${ele}`, { state: this.register });
    }
    else if(ele === "About") {
      this.router.navigateByUrl(`Home/${ele}`, { state: this.register });
    } 
    else if(ele === "Consultation") {
      this.router.navigateByUrl(`Home/${ele}`, { state: this.register });
    } 
    else {
      this.getLatestAccessCode();
      const isDoctor = this.getCookieDisclaimer("isAssistant") === 'false' || this.getCookieDisclaimer("isAssistant") !== 'true' ? true : false;
      if(isDoctor){
       this.router.navigateByUrl(`Home/${ele}`, { state: this.register });
      } else{
        this.open(this.doctorCode);
        this.clickItem = ele;
      }
    }


  }
  isActive(item: any) {

    if(this.isAssistantMode == false) {
      return this.selected === item;
    }
    return this.selected
  };

  prescriptionSelected(selected: any) {
    this.selected=selected
  }

  doctorAssistant() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'isAssistant' + '='+ true + ';expires=' + expires + ';path=/';
    // this.router.navigateByUrl('Home/Patients');
    this.isAssistantMode= true;
    this.selected = 'Patients';
    // this.isAssistantMode= true;

    this.changedoctorCode = false;
    this.router.navigateByUrl('Home');

  }

  closeResult = '';

  open(content: any) {
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
  changedoctorCode= false;
  doctorCodeValue:any;
  // @ViewChild("doctorCodeValue") doctorCodeValue: any;

  // doctorCodeText(e: any) {

  //   this.doctorCodeValue = e.target.value;
  //   if (e.target.value === this.personalInfo.access_code) {
  //     this.changedoctorCode = true;
  //   } else {
  //     this.changedoctorCode = false;

  //   }
  // }

  changedoctorChange(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    // console.log(this.doctorCodeValue,this.latestAccessCode)

    if(this.doctorCodeValue == this.latestAccessCode) {
      this.isAssistantMode = false;
      this.selected = this.clickItem;
      this.router.navigateByUrl(`Home/${this.selected}`, { state: this.register });
      document.cookie = 'isAssistant' + '='+ false + ';expires=' + expires + ';path=/';
      // this.router.navigateByUrl(`Home/${this.selected}`);
    } else {
      this.isAssistantMode= true;
      document.cookie = 'isAssistant' + '='+ true + ';expires=' + expires + ';path=/';
    }
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


  firstTimeLogin(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    this.isAssistantMode= false;
    this.selected = this.clickItem;
    document.cookie = 'isAssistant' + '='+ false + ';expires=' + expires + ';path=/';
  }

  
  getAllDataFromCookies(){

    // public register = { registerStepNum:'0', token:"", personalInfo:{}};
    this.register.token = this.getSpecificCookie('userToken');
    let personalInfo = this.getSpecificCookie('userPersonalInfo');
    let userStatus = this.getSpecificCookie('userStatus');
    let isAssistant = this.getSpecificCookie('isAssistant');
    this.register.personalInfo = JSON.parse(personalInfo);
    this.register.registerStepNum = userStatus;
    this.personalInfo = JSON.parse(personalInfo);
    if( this.register.token != '') {
      this.getUserPersonalObject( this.register.token,JSON.parse(personalInfo), userStatus);
      this.goToYourPage(userStatus);
      // //console.log('datafromcoookies', token, JSON.parse(personalInfo), userStatus)
    } else {
      this.router.navigateByUrl('auth/SignIn');
    }
    if(isAssistant == '' || isAssistant == 'true') {
      this.isAssistantMode =  true;
    } else {
      this.isAssistantMode =  false;
    }
  }

  apiUrl = environment.apiUrl;



  getUpdatedPersonalInfo() {
    axios({
      url: `${this.apiUrl}personal_data`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"
      },
    }).then((res) => {
      //debugger
      //console.log(res)
    })
    .catch(error=>{
      this.validatorService.handelError(error)
    })
  }
  goToYourPage(status:any){
    status = Number(status);
    if(status == 6) {
      this.router.navigateByUrl('Home', { state: this.register });
    }
  }
  getUserPersonalObject(token:any,  personalInfo:any, status: any,) {
    this.register.token = token;
    this.register.registerStepNum = status;
    this.register.personalInfo = personalInfo;
  }


  allowOnlyNumber($event:any){
    this.validatorsService.allowOnlyNumber($event)
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


  
}
