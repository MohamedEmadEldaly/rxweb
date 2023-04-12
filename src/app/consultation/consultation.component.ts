import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import axios from 'types-axios';
import { environment as env, environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/_services/toast.service';


import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
import { scan } from 'rxjs/operators';
import { ClinicsService } from 'src/app/core/_services/clinics.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.scss']
})
export class ConsultationComponent implements OnInit {
  apiUrl = environment.apiUrl;
  constructor(private modalService: NgbModal, private activatedroute: ActivatedRoute,public ToastService: ToastService,  
    private router: Router,
    private _authService : AuthenticationService,
    private toasterService : ToastrService,
    private validatorsService : ValidatorsService,
    private _clinicService : ClinicsService,
    private _toasterService : ToastrService,
    private validatorService : ValidatorsService
    ) {
    this.activatedroute.data.subscribe((data: any) => {
      ////console.log("appoinntments home", this.router.getCurrentNavigation()?.extras.state);
      //debugger
      if (this.router.getCurrentNavigation()?.extras.state != undefined) {
        this.personalDataObject = this.router.getCurrentNavigation()?.extras.state?.personalInfo;
      } else {
          let token = this.getCookieDisclaimer("userToken")
          axios({
            url: `${this.apiUrl}personal-info`,
            method: "POST",
            data : {},
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': "Bearer " + token,
      
            },
          }).then((res) => {
            this.personalDataObject = res.data.data.user;
          }).catch(error=>{
            this.validatorService.handelError(error)
          })
      
      
      }
    })
  }
  personalDataObject: any = {}
  isLoaderShow: boolean = true;
  @ViewChild('doctorCode') doctorCode: any;
  noDataFound:boolean = false;
  filterList: any = ['Old','Current', 'Upcoming'];
  selectedItem: any = 'Current';
  selectedCard: any;
  selectedHistory: any;
  welcomeImage: boolean = true;
  upcomingDetails: boolean = false;
  addPrescriptionShow: boolean = false;
  isDetailsLoaderShow: boolean = false;
  prescriptionDetails = false;
  isUpcoming: boolean = false;
  isOld: boolean = false;
  isPatientPrescriptions: boolean = false;
  printPdfDetails: boolean = false;
  accessToken: any;
  isCurrent: boolean = true;
  pageNumber: any = 1;
  isPrescriptionBtnShow: boolean = true;
  activeAppointmentId: any = null;
  activeAppointmentHistoryId: any=null;
  dataType: any = 2;
  selectedAppointmentDetail: any = {};
  appointmemtsList: any = [];
  isAppointmentShow = false;
  @ViewChild("prescriptionNote") prescriptionNote: any;
  @ViewChild("prescriptionRx") prescriptionRx: any;
  @ViewChild("prescriptionLab") prescriptionLab: any;
  @ViewChild("prescriptionScan") prescriptionScan: any;
  @ViewChild("doctorClinic") doctorClinic: any;
  @ViewChild("searchInput") searchInput: any;
  searchKeyword:any='';
  isAssistantMode = true;

  addPrescriptionForm!:FormGroup;

  latestSelectedPatient! : any;

  prescriptionDetailsPrint: any;
  prescriptionDetailsRxData: any = []
  prescriptionDetailsScanData: any = []
  prescriptionDetailsLabData: any = []
  prescriptionHistory = [
    {
      "patient": {
        "patient_id": 6,
        "patient_name": "vzvsvs",
        "patient_phone": "01020845637",
        "patient_countryCode": "20",
        "patient_address": "hxgzvzhz",
        "patient_gender": 1,
        "patient_birthDate": "2010-06-16 00:00:00",
        "patient_age": ""
      },
      "doctor": {
        "id": 2,
        "image": "/assets/uploads/doctors/2021/06/16/202106160155501317663882_doctors.jpeg",
        "name": "احمد",
        "name_ar": "احمد",
        "name_en": "لللا",
        "degree_en": "Proffesor",
        "degree_ar": "أستاذ",
        "speciality_id": "43",
        "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
        "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
        "university": "ggff",
        "signature": "/assets/uploads/doctors/2021/06/16/202106160156261665746951_doctors.svg"
      },
      "clinic": {
        "id": 2,
        "name": "hdhdhd",
        "phone": "01048787799",
        "address": "vzvzbzbx"
      },
      "appointment": {
        "appointment_id": 3,
        "appointment_date": "2021-06-16 00:00:00",
        "diagnosis": "hdhdhd"
      },
      "rx_data": {
        "id": 2,
        "rx_items": [
          {
            "rx_id": 2,
            "rx": "hxhdhd"
          }
        ],
        "scan_items": [
          {
            "rx_id": 2,
            "scan": "bxbdhd"
          }
        ],
        "lab_items": [
          {
            "rx_id": 2,
            "lab": "dbxbhd"
          }
        ]
      }
    }, {
      "patient": {
        "patient_id": 6,
        "patient_name": "vzvsvs",
        "patient_phone": "01020845637",
        "patient_countryCode": "20",
        "patient_address": "hxgzvzhz",
        "patient_gender": 1,
        "patient_birthDate": "2010-06-16 00:00:00",
        "patient_age": ""
      },
      "doctor": {
        "id": 2,
        "image": "/assets/uploads/doctors/2021/06/16/202106160155501317663882_doctors.jpeg",
        "name": "احمد",
        "name_ar": "احمد",
        "name_en": "لللا",
        "degree_en": "Proffesor",
        "degree_ar": "أستاذ",
        "speciality_id": "43",
        "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
        "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
        "university": "ggff",
        "signature": "/assets/uploads/doctors/2021/06/16/202106160156261665746951_doctors.svg"
      },
      "clinic": {
        "id": 2,
        "name": "hdhdhd",
        "phone": "01048787799",
        "address": "vzvzbzbx"
      },
      "appointment": {
        "appointment_id": 3,
        "appointment_date": "2021-06-16 00:00:00",
        "diagnosis": "hdhdhd"
      },
      "rx_data": {
        "id": 2,
        "rx_items": [
          {
            "rx_id": 2,
            "rx": "hxhdhd"
          }
        ],
        "scan_items": [
          {
            "rx_id": 2,
            "scan": "bxbdhd"
          }
        ],
        "lab_items": [
          {
            "rx_id": 2,
            "lab": "dbxbhd"
          }
        ]
      }
    }
  ]
  prescriptionData: any = {
    appointment_id: null,
    rx: [],
    lab: [],
    scan: [],
    diagnosis: "",
  };
  addPrescription() {
    this.upcomingDetails = false;
    this.selectAppIndex=-1;
    this.prescriptionData.rx = [];
    this.prescriptionData.lab = [];
    this.prescriptionData.scan =[];
    this.prescriptionData.diagnosis ='';
    this.prescriptionRxEditValue='';
    this.prescriptionLabEditValue='';
    this.prescriptionScanEditValue='';
    this.prescriptionNoteEditValue='';
    this.addPrescriptionShow = true;

  }
  clinicFilterId = '';
  doctorClinisData = [
    {
      name: "All Clinics",
      id: ''
    }
  ];
  appointmemtsListTry: any = [
    {
      "patient": {
        "id": 10,
        "name": "اؤتياي",
        "phone": "01020845677",
        "gender": "Female",
        "age": "",
        "countryCode": "20"
      },
      "doctor": {
        "id": 2,
        "name": "احمد",
        "name_ar": "احمد",
        "name_en": "ahmed",
        "degree_en": "Proffesor",
        "degree_ar": "أستاذ",
        "image": "/assets/uploads/doctors/2021/06/16/202106160155501317663882_doctors.jpeg",
        "phone": "01020845637",
        "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
        "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
        "university": "ggff",
        "accept": 0
      },
      "appointment": {
        "id": 11,
        "date": "2021-06-20",
        "fees_type": 1,
        "fees": 200,
        "fees_currency": "1",
        "payment_method": "cash"
      },
      "clinic": {
        "id": 2,
        "name": "hdhdhd",
        "phone": "01048787799",
        "address": "vzvzbzbx",
        "lat": "30.888334411028644",
        "lng": "30.965219289064407"
      },
      "rx": null
    },
    {
      "patient": {
        "id": 2,
        "name": "hegy",
        "phone": "01068282376",
        "gender": "Female",
        "age": "",
        "countryCode": "20"
      },
      "doctor": {
        "id": 2,
        "name": "احمد",
        "name_ar": "احمد",
        "name_en": "ahmed",
        "degree_en": "Proffesor",
        "degree_ar": "أستاذ",
        "image": "/assets/uploads/doctors/2021/06/16/202106160155501317663882_doctors.jpeg",
        "phone": "01020845637",
        "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
        "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
        "university": "ggff",
        "accept": 0
      },
      "appointment": {
        "id": 10,
        "date": "2021-06-20",
        "fees_type": 1,
        "fees": 200,
        "fees_currency": "1",
        "payment_method": "cash"
      },
      "clinic": {
        "id": 2,
        "name": "hdhdhd",
        "phone": "01048787799",
        "address": "vzvzbzbx",
        "lat": "30.888334411028644",
        "lng": "30.965219289064407"
      },
      "rx": {
        "patient": {
          "patient_id": 2,
          "patient_name": "hegy",
          "patient_phone": "01068282376",
          "patient_countryCode": "20",
          "patient_address": "شارع الجامعه",
          "patient_gender": 1,
          "patient_birthDate": "1972-12-31 00:00:00",
          "patient_age": ""
        },
        "doctor": {
          "id": 2,
          "image": "/assets/uploads/doctors/2021/06/16/202106160155501317663882_doctors.jpeg",
          "name": "احمد",
          "name_ar": "احمد",
          "name_en": "ahmed",
          "degree_en": "Proffesor",
          "degree_ar": "أستاذ",
          "speciality_id": "43",
          "speciality_en": "Vascular surgery(Arteries and Vein surgery) ",
          "speciality_ar": " جراحة الأوعيه الدمويه(جراحة الشرايين والأورده) ",
          "university": "ggff",
          "signature": "/assets/uploads/doctors/2021/06/16/202106160156261665746951_doctors.svg"
        },
        "clinic": {
          "id": 2,
          "name": "hdhdhd",
          "phone": "01048787799",
          "address": "vzvzbzbx"
        },
        "appointment": {
          "appointment_id": 10,
          "appointment_date": "2021-06-20 00:00:00",
          "diagnosis": "ورورو"
        },
        "rx_data": {
          "id": 14,
          "rx_items": [
            {
              "rx_id": 14,
              "rx": "ورورتر"
            },
            {
              "rx_id": 14,
              "rx": "ورورتر"
            },
            {
              "rx_id": 14,
              "rx": "ترتبت"
            }
          ],
          "scan_items": [
            {
              "rx_id": 14,
              "scan": "ورورتر"
            },
            {
              "rx_id": 14,
              "scan": "ورورتر"
            },
            {
              "rx_id": 14,
              "scan": "زؤويور"
            }
          ],
          "lab_items": [
            {
              "rx_id": 14,
              "lab": "ترتبت"
            },
            {
              "rx_id": 14,
              "lab": "نرتبتتب"
            },
            {
              "rx_id": 14,
              "lab": "ترتيت"
            }
          ]
        }
      }
    }
  ]
  generateimageUrl(url: any) {
    let genUrl = environment.assetUrl + url
    return genUrl;
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
  toDay:any;
  today() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.toDay = mm + '/' + dd + '/' + yyyy;
    // document.write(today);
  }


  latestAccessCode : any;
  changedoctorCode= false;
  isDoctor!:any;


  ngOnInit(): void {
    document.querySelector(".doctor-assistant")?.classList.add("d-none");
    this.today();
    this.accessToken = this.getCookieDisclaimer("userToken");
    // this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId);
    this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);

    this.isDoctor = this.getCookieDisclaimer("isAssistant") === 'false' || this.getCookieDisclaimer("isAssistant") !== 'true' ? true : false;

    this.getDoctorClinis();
    setTimeout(()=>{
      this.getNextPageList();

    }, 50)

    this._authService.getAccessCode()
    .subscribe((res:any)=>{
      this.latestAccessCode = res.data.accessCode;
    },(error) =>{
      this.toasterService.error(error.error.message)
    })


    this.addPrescriptionForm = new FormGroup({
      notes : new FormControl(''),
      rx : new FormControl(''),
      labs : new FormControl(''),
      scan : new FormControl(''),
    }
    )
    this.addPrescriptionForm.setValidators([this.atLeastOneValidator()]);



    this.accessCodeForm = new FormGroup({
      codeOne : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeTwo : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeThree : new FormControl('',[Validators.required,RxwebValidators.digit()]),
      codeFour : new FormControl('',[Validators.required,RxwebValidators.digit()]),
    })

    
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
  
  appointmentType(typeId: any) {
    if (typeId == 1) {
      return 'Regular'
    } else if (typeId == 2) {
      return "Urgent"
    } else if (typeId == 3) {
      return "Home Visit"
    } else if (typeId == 4) {
      return "Video Consult"
    } else {
      return "Consult"
    }

  }

  appointmentTypeClass(typeId: any) {
    if (typeId == 1) {
      return 'regular'
    } else if (typeId == 2) {
      return "urgent"
    } else if (typeId == 3) {
      return "home-visit"
    } else if (typeId == 4) {
      return "video-Consult"
    } else {
      return "Consult"
    }

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
  getdate(date: any) {
    return date.split(' ')[0]
  }
  selectAppIndex= -1;
  appointmentDate! : any;

  listDetailsClick(event: any, newValue: any, indx: any) {
    this.SelectedAppointmentList = [];
    this.isDoctor = this.getCookieDisclaimer("isAssistant") === 'false' || this.getCookieDisclaimer("isAssistant") !== 'true' ? true : false;
    if(!this.isDoctor){
      event.preventDefault();
      this.verifyCode();
      // console.log("is asstistant not allowed to enter")
      this.selectedCard = newValue;  // don't forget to update the model here
      this.selectedAppointmentDetail = [];
      // this.welcomeImage = false;
      // this.upcomingDetails = true;

      this.addPrescriptionShow = false;
      this.prescriptionDetails = false;
      this.printPdfDetails = false;

      this.isAppointmentShow = false;

      this.selectAppIndex = indx;

      this.selectedAppointmentDetail = this.appointmemtsList[indx];
      this.activeAppointmentId = this.appointmemtsList[indx].appointment.id
      this.activeAppointmentHistoryId = this.appointmemtsList[indx].patient.id;
      this.appointmentDate = this.appointmemtsList[indx].appointment.date;
    } else {
      //debugger
      if(this.selectedDeletedAppointment == indx) {
        this.isDetailsAppointmentShow = true;
      } else {
        this.isDetailsAppointmentShow = false;
      }
      this.selectedCard = newValue;  // don't forget to update the model here
      this.selectedAppointmentDetail = [];
      this.welcomeImage = false;
      this.upcomingDetails = true;
      this.addPrescriptionShow = false;
      this.prescriptionDetails = false;
      this.printPdfDetails = false;
      this.isAppointmentShow = false;
      this.selectAppIndex = indx;
      this.selectedAppointmentDetail = this.appointmemtsList[indx];
      this.activeAppointmentId = this.appointmemtsList[indx].appointment.id
      this.activeAppointmentHistoryId = this.appointmemtsList[indx].patient.id;
      this.appointmentDate = this.appointmemtsList[indx].appointment.date;
      //console.log("selectedAppointmentDetail", this.selectedAppointmentDetail, this.activeAppointmentId)
    }
   

  }
  historyDetailsClick(event: any, newValue: any, indx: any) {
    this.selectedHistory = newValue;  // don't forget to update the model here
    // this.selectedAppointmentDetail = [];
    this.welcomeImage = false;
    this.upcomingDetails = false;
    this.selectAppIndex = -1;
    this.addPrescriptionShow = false;
    this.printPdfDetails = false;
    this.prescriptionDetails = true;
    this.prescriptionDetailsPrint = this.prescriptionHistory[indx];
    this.prescriptionDetailsRxData = this.prescriptionDetailsPrint.rx_data.rx_items;
    this.prescriptionDetailsScanData = this.prescriptionDetailsPrint.rx_data.scan_items;
    this.prescriptionDetailsLabData = this.prescriptionDetailsPrint.rx_data.lab_items;
    ////console.log("prescriptionDetailsScanData ", this.prescriptionDetailsLabData, this.prescriptionDetailsScanData);
    // console.log(this.prescriptionDetailsPrint)
    // console.log("open perception")

  }

  listClick(event: any, newValue: any) {
    this.pageNumber = 1;
    this.isThereItems = true;
    this.appointmemtsList =[]
    if (newValue == 'Upcoming') {
      this.dataType = 3;
      this.isUpcoming = true;
      this.isOld = false;
      this.isCurrent = false;
      this.welcomeImage = true;
      this.upcomingDetails = false;
      this.selectAppIndex = -1;
      this.noDataFound = false;
      this.addPrescriptionShow = false;
      this.prescriptionDetails = false;
      this.isPrescriptionBtnShow = false;
      this.printPdfDetails = false;
    } else if (newValue == 'Current') {
      this.dataType = 2;
      this.isUpcoming = false;
      this.isOld = false;
      this.isCurrent = true;
      this.welcomeImage = true;
      this.upcomingDetails = false;
      this.noDataFound = false;
      this.selectAppIndex = -1;
      this.addPrescriptionShow = false;
      this.isPrescriptionBtnShow = true;
      this.prescriptionDetails = false;
      this.printPdfDetails = false;

    } else {
      this.dataType = 1;
      this.isUpcoming = false;
      this.isOld = true;
      this.isCurrent = false;
      this.isPrescriptionBtnShow = true;
      this.welcomeImage = true;
      this.upcomingDetails = false;
      this.noDataFound = false;
      this.selectAppIndex = -1;
      this.addPrescriptionShow = false;
      this.prescriptionDetails = false;
      this.printPdfDetails = false;

    }
    this.selectedItem = newValue;  // don't forget to update the model here
    // this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId)
    this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);


    // ... do other stuff here ...
  }
  isThereItems:boolean=true;
  ajaxFinishLoading:boolean= false;
  searchPatientNumber() {
    //debugger
    this.appointmemtsList = [];
    this.pageNumber =1;
    // if(this.searchKeyword.trim() != '') {
      this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);
    // }

  }
  getNextPageList(){
     //start Observer
     ////console.log("i aaaaaaaaaaaaaaam heeeeeeeeeeeeereeee ouside ");
     var observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.isThereItems == true && this.ajaxFinishLoading) {
            //debugger
            setTimeout(() => {
              ////console.log("i aaaaaaaaaaaaaaam heeeeeeeeeeeeereeee");
              // this.getPatientsList(this.clinicId, this.searchKeyword);
              if(this.isPatientPrescriptions == true) {
                 this.getPatientPrescription(this.pageNumber)
              } else {
                // this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId);
                this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);

              }

            }, 500);
          }
        }
      });
    });
    // const container = document.querySelector(".main-footer");
    const container = document.querySelector(".oberver-item");
    if(container != null) {
      observer.observe(container);
    }
  }
  updateSerachWord(e:any){
    //debugger
    this.searchKeyword = e.target.value;
  }
  searchWord(e: any) {
    //debugger
     e.preventDefault()
    ////console.log("seeaaaaaaaaaaarch", this.searchKeyword)
    this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);

  }
  // pageNumber:any=1;
  getAppointmentsData(dataType: any, pageNumber: any, clinicId: any , keyword:any) {
    this.noDataFound = false;
    this.isLoaderShow = true;
    // this.appointmemtsList = [];
    this.ajaxFinishLoading = false;

    // this.welcomeImage = true;   // it will return after add prescription
    this.upcomingDetails = false;

    if(pageNumber > 1) {
      this.selectedAppointmentDetail = {}
    }
    //debugger

    // this.selectAppIndex = indx;
    if(this.selectAppIndex != -1) {
      this.selectedAppointmentDetail = this.appointmemtsList[this.selectAppIndex];
      this.isAppointmentShow = false;
      this.upcomingDetails = true

    }

    axios({
      url: `${this.apiUrl}outClinic_appointments?page=${pageNumber}&keyword=${keyword}&date_type=${dataType}&clinic_id=${clinicId}`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {
      // console.log(res)
      //debugger
      if(this.selectAppIndex != -1) {
        this.selectedAppointmentDetail = this.appointmemtsList[this.selectAppIndex];
        this.upcomingDetails = true

      }
      ////console.log("resssoooopse msg appoinnnntments", res.data.data);
      this.isLoaderShow = false;
      setTimeout(()=> {
        this.ajaxFinishLoading = true;

      }, 50)
      this.pageNumber++;
      if(res.data.data.length == 0) {
        this.isThereItems = false;
      }
      this.appointmemtsList = this.appointmemtsList.concat(res.data.data);
      // console.log(this.appointmemtsList)
      if(this.appointmemtsList.length > 10) {
        this.isThereItems = false;

      }
      if(this.appointmemtsList.length == 0) {
        this.noDataFound = true
        document.querySelector('.oberver-item')?.classList.add("d-none");
      } else {
        this.noDataFound = false
        document.querySelector('.oberver-item')?.classList.remove("d-none");
      }
    }).catch((error) => {
      //debugger
      this.validatorService.handelError(error)
      //  this.show(error.response.data.errors[0]);
       this.isLoaderShow = false;

      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });


  }
  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }
  isDeleteLoaderShow:boolean= false;

  deleteAppointment(e: any, i: any) {
    this.isDeleteLoaderShow = true;
    ////console.log("deleeeeeeeeete", i, this.appointmemtsList[i])
    e.stopPropagation();
    let formData = new FormData();
    formData.append('appointments_ids[0]', this.appointmemtsList[i].appointment.id);
    formData.append('cacncel_reasons[0]', 'cancel');
    axios({
      url: `${this.apiUrl}cancel_appointment`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      ////console.log("deeeeeeeeeeelte success msg clinics", res.data);
      this.appointmemtsList.splice(i, 1);
      this.showSuccess(res.data.message);

       this.isDeleteLoaderShow = false;
       if(this.appointmemtsList == 0) {
          this.noDataFound = true;
       }
       if(this.isDetailsAppointmentShow) {
        this.selectedAppointmentDetail = [];
        this.welcomeImage = true;
        this.upcomingDetails = false;
        this.addPrescriptionShow = false;
        this.prescriptionDetails = false;
        this.printPdfDetails = false;
        this.isAppointmentShow = false;
        this.selectAppIndex = -1;
       }
      // if(this.appointmemtsList.lemgth)
    }).catch((error) => {
      this.showSuccess(error.response.data.errors[0]);
      this.isDeleteLoaderShow = false;

      //  this.isLoaderShow = false;

      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });
  }

  confirmDeleteAppointment(e:any) {
    this.deleteAppointment(e, this.selectedDeletedAppointment)
  }
  closeResult = '';
  selectedDeletedAppointment:any='';
  isDetailsAppointmentShow:boolean= false;

  open(content: any, appoitIndex:any) {
    //debugger
    this.selectedDeletedAppointment =  appoitIndex;
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

  verifyCode(){
    // console.log(this.isAssistantMode)
    if(this.isAssistantMode){
      this.openModal(this.doctorCode)
    }
  }

  //modalFun
  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  prescriptionRxEditValue='';
  prescriptionLabEditValue='';
  prescriptionScanEditValue='';
  prescriptionNoteEditValue='';
  prescriptionDetailsRxId = '';

  prescriptionRxEdit() {
    this.prescriptionRxEditValue = this.prescriptionDetailsRxData.join()
  }

  isRxEdit:boolean = false;

  prescriptionEdit() {
    this.addPrescriptionShow = true;
    this.prescriptionDetails = false;
    this.isRxEdit = true;

  }

  sendPrescription() {
    //debugger
    this.isDetailsLoaderShow= true;
    this.prescriptionData.rx = this.prescriptionRx.nativeElement.value.split(/\n/);
    this.prescriptionData.scan = this.prescriptionScan.nativeElement.value.split(/\n/);
    this.prescriptionData.lab = this.prescriptionLab.nativeElement.value.split(/\n/);
    this.prescriptionData.diagnosis = this.prescriptionNote.nativeElement.value;
    this.prescriptionData.appointment_id = this.activeAppointmentId;
    if(this.isRxEdit == true) {
      this.prescriptionData.rx_id = this.prescriptionDetailsRxId;
    }
    axios({
      url: `${this.apiUrl}add_rx`,
      method: "POST",
      data: this.prescriptionData,
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      this.prescriptionDetailsPrint = res.data.data;
      this.prescriptionDetailsRxData = this.prescriptionDetailsPrint.rx_data.rx_items;
      this.prescriptionDetailsScanData = this.prescriptionDetailsPrint.rx_data.scan_items;
      this.prescriptionDetailsLabData = this.prescriptionDetailsPrint.rx_data.lab_items;
      this.prescriptionDetailsRxId = this.prescriptionDetailsPrint.rx_data.id;
      this.addPrescriptionShow = false;
      this.prescriptionDetails = true;
      this.isDetailsLoaderShow = false;
      this.isRxEdit = false;

      ////console.log("prescription add", this.prescriptionDetailsLabData, this.prescriptionDetailsPrint);
      // this.prescriptionScanEditValue = this.prescriptionDetailsScanData.scan.join();
      // this.prescriptionLabEditValue = this.prescriptionDetailsLabData.lab.join();
      // this.prescriptionRxEditValue = this.prescriptionDetailsRxData.rx.join();



    }).catch((error) => {
      this.showSuccess(error.response.data.errors[0]);
      this.isDetailsLoaderShow= false;


      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });

  }
  
  prescriptionShow() {
    this.prescriptionHistory = []
    this.welcomeImage = true;
    this.upcomingDetails = false;
    // this.selectAppIndex = -1;
    this.addPrescriptionShow = false;
    this.prescriptionDetails = false;
    this.isPatientPrescriptions = true;
    this.printPdfDetails = false;
    this.pageNumber=1;
    this.getPatientPrescription(this.pageNumber);
    setTimeout(()=> {
      this.getNextPageList()
    }, 100)
  }

  returnToAppointment() {
    this.isLoaderShow = false;
    this.upcomingDetails = false;
    // this.selectAppIndex = -1;
    if(this.selectAppIndex != -1) {
      this.selectedAppointmentDetail = this.appointmemtsList[this.selectAppIndex];
      this.upcomingDetails = true;
      this.welcomeImage = false;

    } else {
      this.welcomeImage = true;

    }
    this.addPrescriptionShow = false;
    this.prescriptionDetails = false;
    this.printPdfDetails = false;
    this.isPatientPrescriptions = false;
    this.noDataFound = false;
    this.pageNumber = 1;
  }

  getPatientPrescription(pageNumber:any) {
    this.isLoaderShow = true;
    this.ajaxFinishLoading = false;
    axios({
      url: `${this.apiUrl}rx_history?patient_id=${this.activeAppointmentHistoryId}?page=${pageNumber}`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {
      // ////console.log(this.prescriptionDetailsPrint)
      ////console.log("resssoooopse msg clinics", res.data.data);
      this.isLoaderShow = false;
      this.ajaxFinishLoading = true;
      if(res.data.data.length == 0) {
        this.isThereItems = false;
      }
      this.pageNumber++;
      this.prescriptionHistory = this.prescriptionHistory.concat(res.data.data);
      if(this.prescriptionHistory.length == 0) {
        this.noDataFound = true;

      }


    }).catch((error) => {
      this.showSuccess(error.response.data.errors[0]);
      this.isLoaderShow = false;


      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });


  }

  getDoctorClinis() {
    axios({
      url: `https://rx-egy.com/api/v2/doctor_clinics`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,
        'Accept-Language': "en"

      },
    }).then((res) => {

      ////console.log("resssoooopse msg clinics", res.data.data);
      // this.isLoaderShow = false;
      res.data.data.forEach((element: any) => {
        this.doctorClinisData.push(element)
      });

      // this.doctorClinisData = res.data.data;
      // this.bookData.clinic_id = this.doctorClinisData[0].id

      //
      // this.doctorClinisData.unshift({
      //   name: "All Clinics"
      // })
      // this.selectedItem = this.doctorClinisData[0]
      // res.data.data.map(function(x: object){return(x.name)})
      // this.constructClinicsArr(this.doctorClinisData)

    }).catch((error) => {
      //debugger
      // this.showSuccess(error.response.data.errors[0]);
      // this.isLoaderShow = false;
      this.validatorService.handelError(error)


      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });

  }

  clinicSearch() {
    this.clinicFilterId = this.doctorClinic.nativeElement.value;
    this.pageNumber = 1;
    this.isThereItems = true;
    this.appointmemtsList =[]
    ////console.log("clinic search")
    // this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId);
    this.getAppointmentsData(this.dataType, this.pageNumber, this.clinicFilterId, this.searchKeyword);

  }

  covertToRxFormat() {
    this.prescriptionDetails = false;
    this.printPdfDetails = true;
  }
  printPrescription() {
//     let doc = new jsPDF()
//     let printContainer = document.getElementById("print-container");
// //     var img = new Image()
// // // img.src = this.generateimageUrl(this.personalDataObject.signature_image)
// // img.src ="../../../../../rxwebapp/src/assets/images/loader.gif";
// // doc.addImage(img, 'gif', 10, 78, 12, 15)
//     this.generatePDF(printContainer)
    window.print();

  }
  generatePDF(htmlContent: any) {
    html2canvas(htmlContent).then(canvas => {
      let imgWidth = 300;
      // let imgHeight = (canvas.height * imgWidth / canvas.width)
      let imgHeight = 210;
      //debugger
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('prescription.pdf')
    })




  }

  doctorCodeValue : any;

  changedoctorChange(){
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();

    if(this.doctorCodeValue == this.latestAccessCode) {
      this.isAssistantMode= false;
      // this.router.navigateByUrl(`Home/${this.selected}`, { state: this.register });
      document.cookie = 'isAssistant' + '='+ false + ';expires=' + expires + ';path=/';
      // this.router.navigateByUrl(`Home/${this.selected}`);
    } else {
      this.isAssistantMode= true;
      document.cookie = 'isAssistant' + '='+ true + ';expires=' + expires + ';path=/';
    }
  }

  accessCodeForm! : FormGroup;


  enterCode(){
    const  userCode = this.accessCodeForm.value['codeOne'] + this.accessCodeForm.value['codeTwo'] + this.accessCodeForm.value['codeThree'] + this.accessCodeForm.value['codeFour'];
    this.doctorCodeValue = userCode;
    if (userCode === this.latestAccessCode) {
      this.changedoctorCode = true;
      this.changedoctorChange();
      this.upcomingDetails = true;
      this.welcomeImage = false;
      this.accessCodeForm.reset();
    } else {
      this.changedoctorCode = false;
      this.toasterService.error("Wrong access Code","Error");
      this.accessCodeForm.reset();
    }
  }

  allowOnlyNumber($event:any){
    this.validatorsService.allowOnlyNumber($event)
  }


  // atLeastOneIsNotNull() : ValidatorFn {
  //   return (group : FormGroup) : null =>{
      
  //     return null
  //   }
  // }


  // this.addPrescriptionForm = new FormGroup({
  //   notes : new FormControl(''),
  //   rx : new FormControl(''),
  //   labs : new FormControl(''),
  //   scan : new FormControl('')
  // })

  // atLeastOneIsNotNull(notesV: string, rxV: string,labsV:string,scanV:string) {
  //   return (formGroup: FormGroup) => {

     

   

  //     // if (!passwordControl || !confirmPasswordControl) {
  //     //   return null;
  //     // }

  //     // if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
  //     //   return null;
  //     // }

  //     // if (passwordControl.value !== confirmPasswordControl.value) {
  //     //   confirmPasswordControl.setErrors({ passwordMismatch: true });
  //     // } else {
  //     //   confirmPasswordControl.setErrors(null);
  //     // }
  //   }
  // }




  atLeastOneValidator = () => {
    return (controlGroup : any) => {
        let controls = controlGroup.controls;
        if ( controls ) {
            let theOne = Object.keys(controls).find(key => controls[key].value !== '');
            if ( !theOne ) {
                return {
                  atleastOne : {
                        text : 'At least one should be selected'
                    }
                }
            }
        }
        return null;
    };
  };


  SelectedAppointmentList : any = [];

  directToAppointment(){
    this.getPatientAppointment();
    this.welcomeImage = false;
    this.upcomingDetails = false;
    this.addPrescriptionShow = false;
    this.prescriptionDetails = false;
    this.isAppointmentShow = true;
  }
 


  getPatientAppointment(){
    this._clinicService.getAppointments(this.activeAppointmentHistoryId)
    .subscribe((res:any) => {
      this.SelectedAppointmentList = res.data;
      // console.log(res)
    },(error)=>{
      this._toasterService.error(error.message,"Error")
    })
  }


 

  appointmentBack(){
    this.upcomingDetails = true;
    this.isAppointmentShow = false;
  }


  


}
