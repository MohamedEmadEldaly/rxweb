import { HttpClient } from '@angular/common/http';
import { ElementRef, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment as env, environment } from '../../../environments/environment';
import axios from 'types-axios';
import { MatDatepicker } from '@angular/material/datepicker';

import { ToastService } from 'src/app/core/_services/toast.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import SwiperCore from 'swiper/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/app/core/_services/firebase.service';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { EncryptService } from 'src/app/core/_services/encrypt.service';
import { EnumType } from 'typescript';
import { ClinicsService } from 'src/app/core/_services/clinics.service';
import { ToastrService } from 'ngx-toastr';



import {ValidatorsService} from '../../core/_services/validators.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  // @Input() public personalDetails!: FormGroup;
  // doctorClinics:any=['All', 'Clinic 1', 'Clinic 2'];
  doctorClinisData: any;
  accessToken: any;
  isFirstItem: boolean = true;
  selectedItem: any;
  selectedDay: any;
  searchSubmitForm: FormGroup;
  newPatientSubmitForm: FormGroup;
  isLoaderShow: boolean = true;
  isDetailsLoaderShow: boolean = false;
  isSearchPatientShow: boolean = true;
  isAddNewPatientShow: boolean = false;
  isPatientResultShow: boolean = false;
  isBookShow: boolean = false;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  separateDialCode = true;

  isRxHistoryShow = false;
  rxPrintViewShow = false;


  patientPhoneObject : any;


  isAppointmentShow = false;
  selectRxHistoryDetails = false;

  latestSelectedPatient!:any;

  apiUrl = environment.apiUrl;

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date> | undefined;
  patientsList: any = [];
  @ViewChild('searchInput') searchInput: any;
  @ViewChild("gender") gender: any;
  @ViewChild("searchNumber") searchNumber: any;

  @ViewChild('reservedDateModel') reservedDateModel: any;
  searchPatientResult: any = {};
  appointmentType = ['Regular'];
  clinicList: any = [];
  avialableDates: any = [];
  searchPhoneNumder = '';
  searchKeyword: any = '';
  selected_days: any = [];
  clinicId: any = '';
  newPAtientData: any = {
    name: '',
    phone: '',
    country_code: '',
    gender: '',

    address: ''
  }
  genderOption: any = [
    {
      id: 0,
      name: 'Male'
    }, {
      id: 1,
      name: 'Female'
    },
  ]

  isNotThreeStatus : boolean = false;

  bookData: any = {
    patient_id: 1,
    fees_type: 1,
    payment_method: 1,
    clinic_id: '',
    date: ''

  }

  calculateAge(age:any) {
    if(Number(age.year) == 0 && Number(age.month) == 0) {
      return 'Less than month'
    } else if (Number(age.year) == 0 && Number(age.month) != 0) {
      return `${age.month} months`
    } else if (Number(age.year) > 0) {
      return `${age.year} years ${age.month} months`
    }
    return ''
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


  constructor(private fb: FormBuilder,
    private modalService: NgbModal, 
    private http: HttpClient, 
    public ToastService: ToastService,
     private activatedroute: ActivatedRoute,
      private router: Router,
      private _firebaseService : FirebaseService,
      private _authService : AuthenticationService,
      private _crypto : EncryptService,
      private _clinicService : ClinicsService,
      private _toasterService : ToastrService,
      private _validatorService : ValidatorsService
      ) {
    this.searchSubmitForm = this.fb.group({
      phone: ['', [Validators.required]],
    })
    this.newPatientSubmitForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, this.noWhitespaceValidator]]
    })
    this.activatedroute.data.subscribe((data: any) => {
      ////console.log("daaaaaaaaaaaaaaaata patient ", this.router.getCurrentNavigation()?.extras.state);


    })

    

  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  @Output() messageEvent = new EventEmitter<string>();


  message = 'masssesge'

  sendMessage() {
    this.messageEvent.emit(this.message)
  }

  todayDate:any;

  getToDayDate() {
    var today:any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;
    // max="2020-03-31"
    // document.write(today);
  }
  getMinDate() {
    // var today:any = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    this.todayDate = 1920 + '-' + 1 + '-' + 1;
    // max="2020-03-31"
    // document.write(today);
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

  ngOnInit(): void {
    //
    document.querySelector(".doctor-assistant")?.classList.add("d-none");

    this.getToDayDate()

    this.accessToken = this.getCookieDisclaimer("userToken");
    // console.log(this.accessToken)
    this._authService.accessToken =  this.accessToken;

    if(this.accessToken){
      if(!this.clinicId){
        this.clinicId = '';
      }
      this.getPatientsList(this.clinicId, this.searchKeyword);

      this.getDoctorClinis();

      this.getNextPageList();

    }

    const userData = JSON.parse(this.getSpecificCookie("userPersonalInfo"));

    const user = {data : {user : userData },access_token : this.getCookieDisclaimer("userToken")}

    // //console.log(user)
    this._authService.currentUser.next(user);
    this._authService.accessToken = user.access_token;
    this._firebaseService.requestPermission();
    this._firebaseService.receiveMessage();
    // this._firebaseService.requestToken();
    ////console.log("patient access token ", this.accessToken)
  }

  dayClick(event: any, newValue: any) {
    this.bookData.date = newValue.date;
    this.selectedDay = newValue;

  }

  listClick(event: any, newValue: any, clinicId: any) {

    this.isSearchPatientShow = true;
    this.isPatientResultShow = false;
    this.isThereItems = true;
    this.patientsList = [];
    this.pageNumber = 1;
    ////console.log(clinicId)
    if (newValue.name != "All") {
      this.clinicId = clinicId

    } else {
      this.clinicId = ''
    }
    this.getPatientsList(this.clinicId, this.searchKeyword);

    this.selectedItem = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
  }

  onSearchSubmit() {
    if (this.searchSubmitForm.status.toLowerCase() == "valid") {
      ////console.log("sseeeeeeeeeeeeeeearch submit valid", this.searchSubmitForm.status)
      let phone = this.searchSubmitForm.value.phone.nationalNumber;
      this.newPAtientData.country_code = this.searchSubmitForm.value['phone']['dialCode'];

      // code = '02';
      //debugger
      this.searchPatientNumber(phone)

    } else {
      ////console.log("sseeeeeeeeeeeeeeearch submit invalid", this.searchSubmitForm.status)


    }


  }



  onNewPatientSubmit() {
    //debugger
    ////console.log("new patient submit", this.newPatientSubmitForm.status)
    if (this.newPatientSubmitForm.status == 'VALID') {
      this.constructNewPatientObject();
      this.addNewPatient(true)
      this.searchSubmitForm.reset();
    }
  }


  noSpacesEvent($event : any){
    this._validatorService.noSpacesEvent($event);
  }

  join(t: any, a: any, s: any) {
    function format(m: any) {
      let f = new Intl.DateTimeFormat('en', m);
      return f.format(t);
    }
    return a.map(format).join(s);
  }

  customDate: any;

  constructNewPatientObject() {
    //debugger
    this.newPAtientData = { ...this.newPatientSubmitForm.value };
    if (this.newPAtientData.gender == "Male") {
      this.newPAtientData.gender = 1
    } else {
      this.newPAtientData.gender = 2
    }

    this.customDate = [{ year: 'numeric' }, { month: 'numeric' }, { day: 'numeric' }];
    let date = this.join(new Date(this.newPAtientData.age), this.customDate, '/');

    this.newPAtientData.age = date;
    this.newPAtientData.phone = this.searchPhoneNumder;
    // console.log(this.searchSubmitForm.value['phone'])
    this.newPAtientData.country_code = this.patientPhoneObject.dialCode;
  }

  convertObjectFormData(obj: any, isCompelete: any) {
    const formData = new FormData();

    if(this.isNotThreeStatus){
    formData.append('patient_id', obj.id);
    this.isNotThreeStatus = false;
    }
    formData.append('name', obj.name);
    formData.append('phone', obj.phone);
    formData.append('country_code', obj.country_code);
    formData.append('gender', obj.gender);
    formData.append('birth_date', obj.age);
    formData.append('address', obj.address);
    if(isCompelete == false) {
      formData.append('patient_id', this.bookData.patient_id);

    }
    return formData

  }

  isThereItems: boolean = true;
  ajaxFinishLoading: boolean = true;

  getNextPageList() {
    //start Observer
    var observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.isThereItems == true && this.ajaxFinishLoading) {
            setTimeout(() => {
              ////console.log("i aaaaaaaaaaaaaaam heeeeeeeeeeeeereeee");
              this.getPatientsList(this.clinicId, this.searchInput.nativeElement.value);
            }, 500);
          }
        }
      });
    });
    // const container = document.querySelector(".main-footer");
    const container = document.querySelector(".oberver-item");
    if (container != null) {
      observer.observe(container);
    }
  }

  noDataFound: boolean = false;
  pageNumber: any = 1;

  getPatientsList(clinicId: any, keyword: any) {
    this.noDataFound = false;
    this.ajaxFinishLoading = false;
    // this.patientsList = []

    this.isLoaderShow = true;
    axios({
      url: `${this.apiUrl}doctor_patients?page=${this.pageNumber}&keyword=${keyword}&clinic_id=${clinicId}`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"
      },
    }).then((res) => {
      ////console.log("passssent list  msg", res.data.data, res.data.data.length);
      this.isLoaderShow = false;
      this.patientsList = this.patientsList.concat(res.data.data);
      this.isAddNewPatientShow = false;
      this.isSearchPatientShow = true;
      this.isBookShow = false;
      this.ajaxFinishLoading = true;
      this.pageNumber++;
      if (res.data.data.length == 0) {
        this.isThereItems = false;
      }
      if (this.patientsList.length == 0) {
        this.noDataFound = true;
        document.querySelector('.oberver-item')?.classList.add("d-none");
      } else {
        document.querySelector('.oberver-item')?.classList.remove("d-none");

      }

    })
    .catch((error) => {
      this.isLoaderShow = false;
        this._validatorService.handelError(error)
      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });
  }

  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }

  padLeadingZeros(num: any, size: any) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  selectedPatient: any;

  getPatientDetails(indx: any, newValue: any) {
    // hide all views
    this.isAppointmentShow = false;
    this.selectRxHistoryDetails = false;
    this.isRxHistoryShow = false;
    this.rxPrintViewShow = false;
    this.isBookShow = false;

    // hide all views

    this.selectedPatient = newValue;
    let patient = this.patientsList[indx];

    // select selected patient
    this.latestSelectedPatient = this.patientsList[indx];
    // select selected patient

    let patientPhone = patient.phone;

    this.searchPatientNumber(patientPhone);
    
  }
  



  dublicateBookHandle(data: any) {
    if (Number(data.add_by_doctor) == 1) {
      this.isSearchPatientShow = false;
      this.isPatientResultShow = true;
      this.searchPatientResult = data
      this.bookData.patient_id = data.id;
    } else if (data.patient_status !== 3) {
      this.isSearchPatientShow = false;
      this.isPatientResultShow = false;
      this.isAddNewPatientShow = true;
      this.searchPatientResult = data
      this.searchPhoneNumder = `${data.country_code}${data.phone}`;
      this.bookData.patient_id = data.id;
      this.isNotThreeStatus = true;
      // console.log("not three status")
      // this.addNewPatient(false)

    } else {
      this.isSearchPatientShow = false;
      this.isAppointmentShow = false;
      this.isPatientResultShow = true;
      this.searchPatientResult = data
      this.bookData.patient_id = data.id;
    }
    if(data.gender == 'ذكر') {
      this.searchPatientResult.gender = 'Male'
    }




  }


  searchPatientNumber(phone: any) {
    this.isDetailsLoaderShow = true;
    // code= Number(code)
    // phone=Number(phone)
    let num = phone.split(" ").join("");
    num = this.padLeadingZeros(num, num.length);
    //debugger
    axios({
      url: `${this.apiUrl}search_patient?phone=${num}`,
      method: "GET",
      headers: {
        // 'Authorization': "Bearer " + this.accessToken,
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {
      // console.log(res);
      //if no patient 
      if (Object.keys(res.data.data).length === 0) {
        this.isAddNewPatientShow = true;
        this.isSearchPatientShow = false;
        this.searchPhoneNumder = this.searchSubmitForm.value.phone.nationalNumber;
        // this.patientPhoneObject.phone = this.searchSubmitForm.value.phone.nationalNumber;
        // this.patientPhoneObject.internationalNumber = this.searchSubmitForm.value.phone.internationalNumber;
        // this.patientPhoneObject.dialCode = this.searchSubmitForm.value.phone.dialCode;
        this.patientPhoneObject =  this.searchSubmitForm.value.phone;
        // console.log(this.patientPhoneObject)


        // this.patientPhoneObject.international = this.searchSubmitForm.value.phone.dialCode;
        // console.log(this.searchSubmitForm.value.phone.nationalNumber,this.searchSubmitForm.value.phone)
      } else {
        this.dublicateBookHandle(res.data.data)
      }
      this.latestSelectedPatient = res.data.data;
      this.isDetailsLoaderShow = false;
      this.getPatientReservedDates();
      this.isBookShow = false;
      this.searchSubmitForm.reset();

    }).catch((error) => {
      this.isDetailsLoaderShow = false;
      this._validatorService.handelError(error)
    })
  }

  reservedDates:any=[]

  getDoctorClinis() {
    axios({
      url: `https://rx-egy.com/api/v2/doctor_clinics`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"


      },
    }).then((res) => {
      //debugger
      // this.clinicList = res.data.data;
      // this.clinicList.splice(0,1)
      res.data.data.forEach((element: any) => {
        if (element.name != 'All') {
          this.clinicList.push(element)
        }

      });
      this.reservedDates = res.data.reserved_dates;



      // this.isLoaderShow = false;
      // res.data.data.forEach((element:any) => {
      //   this.doctorClinisData.push(element)
      // });

      this.doctorClinisData = res.data.data;
      this.avialableDates = this.doctorClinisData[0].available_dates;
      // this.avialableDates.push({date: "2021-08-18", day: "Wednesday"})
      ////console.log("resssoooopse msg clinics", res.data.data);
      this.selectedDay = this.doctorClinisData[0].available_dates[0];
      this.bookData.clinic_id = this.doctorClinisData[0].id

      //
      this.doctorClinisData.unshift({
        name: "All"
      })
      this.selectedItem = this.doctorClinisData[0]
      // res.data.data.map(function(x: object){return(x.name)})
      // this.constructClinicsArr(this.doctorClinisData)

    })
    .catch(error=>{
      this._validatorService.handelError(error)
    })

  }


  

  getPatientReservedDates() {
    axios({
      url: `https://rx-egy.com/api/v2/doctor_clinics?patient_id=${this.bookData.patient_id}`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"


      },
    }).then((res) => {
      //debugger

      this.reservedDates = res.data.reserved_dates;

    })
    .catch(error=>{
      this._validatorService.handelError(error)
    })

  }
  isClinicRecheck: any = false;
  isClinicUrgent: any = false;
  isClinicRegular: boolean = false;

  showAvailableDates(index: any) {
    ////console.log("cliiiiiiiiiiiiiiiiiiiiiiiiick id", index);
    this.avialableDates = [];
    this.avialableDates = this.clinicList[index].available_dates;
    this.selected_days = [];
    this.bookData.clinic_id = this.clinicList[index].id;
    // appointmentType = ["Regular", "Urgent", "Consultation"];
    this.appointmentType = []

    if (this.clinicList[index].fees_regular == null) {
      this.isClinicRegular = false;
    } else {
      this.isClinicRegular = true;
      this.appointmentType.push('Regular')

    }
    if (this.clinicList[index].fees_urgent == null) {
      this.isClinicUrgent = false;
    } else {
      this.isClinicUrgent = true;
      this.appointmentType.push('Urgent')

    }
    if (this.clinicList[index].fees_recheck == null) {
      this.isClinicRecheck = false;

    } else {
      this.isClinicRecheck = true;
      this.appointmentType.push('Recheck')
    }
    this.selectedDay = this.avialableDates[0];
  }

  onSwiper(swiper: any) {
    ////console.log(swiper);
  }
  onSlideChange() {
    ////console.log('slide change');
  }

  addDay(e: any, item: any) {

    if (e.target.classList[1] == undefined) {
      e.target.classList.add('active')
      this.selected_days.push(item);
      this.bookData.date = item.date;
    } else {
      if (this.selected_days.length > 1) {
        let itemRemovedIndex = this.selected_days.indexOf(item);
        if (itemRemovedIndex != -1) {
          this.selected_days.splice(itemRemovedIndex, 1)
        }
        e.target.classList.remove('active')
      }
    }
  }
  addPaymentType(index: any, Type:any) {
    //debugger
    if (Type == 'Regular') {
      this.bookData.fees_type = 1
    } else if (Type == 'Urgent') {
      this.bookData.fees_type = 2
    } else {
      this.bookData.fees_type = 5
    }
    ////console.log("payment method", this.bookData.payment_method, this.bookData)
  }
  submitBookdata() {
    ////console.log("submit book data")

    this.bookData.date = this.selectedDay.date
    // if(this.bookData.date == '') {
     //debugger

    let isDateBooked = false;
    if(this.reservedDates.includes(this.bookData.date)) {
      isDateBooked = true;
      this.open(this.reservedDateModel)
    } else {
      this.sendBookData()

    }

    // }
  }
  confirmBook() {
    this.sendBookData()
  }
  sendBookData() {
    //debugger
    this.isDetailsLoaderShow = true;
    axios({
      url: `${this.apiUrl}add_appointment`,
      method: "POST",
      data: this.bookData,
      headers: {
        // "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken


      },
    }).then((res) => {

      ////console.log("resssoooopse msg", res.data)
      this.showSuccess(res.data.message);
      this.isBookShow = false
      this.selectedPatient = '';
      this.isSearchPatientShow = true;
      this.searchPatientResult = {};
      this.isDetailsLoaderShow = false;
      this.patientsList = [];
      this.isThereItems = true;
      this.pageNumber = 1;
      this.getPatientsList(this.clinicId, this.searchInput.nativeElement.value);


    }).catch((error) => {
      this.isDetailsLoaderShow = false;
      this.showSuccess(error.response.data.errors[0]);
      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });
  }

  directTobook() {
    this.isPatientResultShow = false;
    this.isBookShow = true;
    this.showAvailableDates(0);
  }


  

  getSearchKeyword() {

    this.searchKeyword = this.searchInput.nativeElement.value;
  }

  onSubmit() {
    //debugger
    ////console.log("submiiiiiiiiiiiiiiiiiiit heeeeeeeeeee")
  }
  
  searchWord(e: any) {
    //debugger
    e.preventDefault()
    this.pageNumber = 1;
    this.patientsList = []
    ////console.log("seeaaaaaaaaaaarch", this.searchInput.nativeElement.value)
    this.getPatientsList(this.clinicId, this.searchInput.nativeElement.value);

  }


  addNewPatient(isDataCompelete: any) {
    //debugger
    this.isDetailsLoaderShow = true;
    this.newPAtientData.phone = this.patientPhoneObject.number.split(" ").join("");

    let formData;

    // console.log(this.isNotThreeStatus)

    if(this.isNotThreeStatus){
      const userData = {
        id:this.bookData.patient_id,
        ...this.newPAtientData
      }
      formData = this.convertObjectFormData(userData, isDataCompelete)
    } else {
      formData = this.convertObjectFormData(this.newPAtientData, isDataCompelete)
    }

    axios({
      url: `${this.apiUrl}add_patient`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {
      // this.isSearchPatientShow = true;
      this.isAddNewPatientShow = false;
      this.isPatientResultShow = true;

      this.searchPatientResult = res.data.data
      this.bookData.patient_id = res.data.data.id;
      ////console.log("resssoooopse news patient Add", res.data)
      this.showSuccess(res.data.message);
      this.isDetailsLoaderShow = false;
      this.newPatientSubmitForm.reset();

    }).catch((error) => {
      this.isDetailsLoaderShow = false;
      this.showSuccess(error.response.data.errors[0]);
      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });
  }

  firstTimeLogin(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'isAssistant' + '='+ false + ';expires=' + expires + ';path=/';
  }



  //rx history

  directToRxHistory(){
    this.getPatientRxHistory();
    this.isPatientResultShow = false;
    this.isPatientResultShow = false;
    this.isAppointmentShow = false;
    this.isRxHistoryShow = true;
  }

  SelectedRxHistoryList : any  = []

  getPatientRxHistory(){
    this._clinicService.getRxHistory(this.latestSelectedPatient.id)
    .subscribe((res:any) => {
      this.SelectedRxHistoryList = res.data;
      // console.log(this.SelectedRxHistoryList)
    },(error)=>{
      this._toasterService.error(error.message,"Error")
    })
  }

  getdate(date: any) {
    return date.split(' ')[0]
  }



  SelectedAppointmentList : any = [];

  directToAppointment(){
    this.getPatientAppointment();
    this.isPatientResultShow = false;
    this.isPatientResultShow = false;
    this.isAppointmentShow = true;
  }


  rxHistoryBack(){
    this.isSearchPatientShow = false;
    this.isPatientResultShow = true;
    this.isAppointmentShow = false;
    this.isRxHistoryShow = false;
  }


  getPatientAppointment(){
    this._clinicService.getAppointments(this.latestSelectedPatient.id)
    .subscribe((res:any) => {
      this.SelectedAppointmentList = res.data;

    },(error)=>{
      this._toasterService.error(error.message,"Error")
    })
  }


  resultBack(){
    this.isSearchPatientShow = true;
    this.isPatientResultShow = false;
  }

  appointmentBack(){
    this.isSearchPatientShow = false;
    this.isPatientResultShow = true;
    this.isAppointmentShow = false;
  }

  currencyType(currecyId: any) {
    if (currecyId == 1) {
      return 'EGP'
    } else if (currecyId == 2) {
      return 'US'
    } else {
      return 'EUR'
    }
  }

  appointmentTypeClass(typeId: any) {
    if (typeId == 1) {
      return 'regular'
    } else if (typeId == 2) {
      return "urgent"
    } else if (typeId == 2) {
      return "home-visit"
    } else if (typeId == 4) {
      return "video-Consult"
    } else {
      return "Consult"
    }

    

  }

  appointmentType2(typeId: any) {
    if (typeId == 1) {
      return 'Regular'
    } else if (typeId == 2) {
      return "Urgent"
    } else if (typeId == 2) {
      return "Home Visit"
    } else if (typeId == 4) {
      return "Video Consult"
    } else {
      return "Consult"
    }

  }

  bookBack(){
    this.isPatientResultShow = true;
    this.isBookShow = false;
  }

  selectRxHistroyitem : any;
  prescriptionDetailsRxData:any;

  selectRxHistroyFun(index : any,item :any){
    this.selectRxHistroyitem = item;
    this.prescriptionDetailsRxData = item.rx_data;
    console.log(item);
    this.isRxHistoryShow = false;
    this.selectRxHistoryDetails = true;
  }

  rxDetailsBack(){
    this.selectRxHistoryDetails = false;
    this.isRxHistoryShow = true;
  }


  generateimageUrl(url: any) {
    let genUrl = environment.assetUrl + url
    return genUrl;
  }


  covertToRxFormat(){
    this.selectRxHistoryDetails = false;
    this.rxPrintViewShow = true;
  }


  rxPrintBack(){
    this.selectRxHistoryDetails = true;
    this.rxPrintViewShow = false;
  }

  printPrescription() {
    window.print();
  }
  

  
}
