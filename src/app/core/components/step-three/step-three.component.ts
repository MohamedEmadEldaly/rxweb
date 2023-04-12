import { Input, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ValidatorsService } from '../../_services/validators.service';

@Component({
  selector: 'register-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {
  @Input() public ConsultationData!: FormGroup;
  constructor(private validatorService : ValidatorsService) { }
  daties: any = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']

  isHomeVisit: boolean = false;
  isVideoConsult: boolean = false;
  @Input() public editMode: boolean = false;
  @Input() public editModeData: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() newItemEventCon = new EventEmitter<any>();

  @ViewChild('homeVisitfees') homeVisitfees: any;
  @ViewChild('videoFrom') videoFrom: any;
  @ViewChild('videoTo') videoTo: any;
  @ViewChild('videoCallfees') videoCallfees: any;
  @ViewChild('videoCallCurrency') videoCallCurrency: any;
  @ViewChild('homeVisitCurrency') homeVisitCurrency: any;
  selectedFromValue:any='';
  selectedToValue:any = '';
  selectedHomeCurrency:any = '';
  selectedVideoCurrency:any = '';
  selectedVideoFee:any = '';



  
  ngOnInit(): void {


    // console.log(this.editModeData);
    //debugger
    if (this.editMode == true) {

      // console.log(this.isHomeVisit);
      if(this.isHomeVisit){
        this.ConsultationData.controls['homeVisit'].setValue(this.editModeData.fees_home_visit);
      }

      if(this.isVideoConsult){
        this.ConsultationData.controls['videoCall'].setValue(this.editModeData.fees_video_call);
      }

      setTimeout(()=> {
        if( this.editModeData.is_home_visit == 1) {
          this.isHomeVisit = true
        } else {
          this.editModeData.fees_home_visit = '';
          this.editModeData.currency = '1'
        }
        if( this.editModeData.is_video_call == 1) {
          this.isVideoConsult = true;
          this.selected_days = this.editModeData.video_selected_days;
          this.selectedFromValue = this.editModeData.video_from.toUpperCase();
          this.selectedFromValue = this.editModeData.video_from.toUpperCase();
          this.selectedToValue = this.editModeData.video_to.toUpperCase();
          this.selectedVideoFee = this.editModeData.fees_video_call;
          this.selectedVideoCurrency = this.editModeData.video_call_currency
          


        } else {
          this.editModeData.fees_video_call = '';
          this.editModeData.video_call_currency = '1';
          this.editModeData.video_from = '';
          this.editModeData.video_to = '';
          this.editModeData.video_selected_days = ["Sunday"]

          this.selectedFromValue ='';
          this.selectedToValue = '';
        }


        // this.selectedFromValue ='4:00 PM';


      }, 50)

    
    } else {
            // console.log("here")
            this.ConsultationData.controls['homeVisit'].clearValidators();
            this.ConsultationData.controls['homeVisit'].updateValueAndValidity();
            this.ConsultationData.controls['homeVisit'].setValidators([]);


            this.ConsultationData.controls['videoCall'].setValidators([]);
            this.ConsultationData.controls['videoCall'].clearValidators();
            this.ConsultationData.controls['videoCall'].updateValueAndValidity();


        
    }

  }


  stepThreeObject = {
    is_home_visit: 0,
    currency: 1,
    is_video_call: 0,
    video_from: '',
    video_to: '',
    video_selected_days: ['saturday'],
    fees_home_visit: '',
    fees_video_call: '12:00 am',
    doctor_video_call_id: '',
    video_call_currency: 1,

  }

  isSelectedDay(day: any) {
    if (this.editModeData.video_selected_days == null) {
      return '';
    } else {
      if (this.editModeData.video_selected_days.includes(day)) {
        return true
      }
    }
    return ''
  }

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  // phoneForm = new FormGroup({
  // 	phone: new FormControl(undefined, [Validators.required])
  // });
  selected_days: any = ['sunday']
  
  addNewItem(value: any) {
    if (this.isHomeVisit == true) {
      value.is_home_visit = 1
      value.fees_home_visit = this.homeVisitfees.nativeElement.value;
      value.currency = 1;
      let homeCurrencyType = this.homeVisitCurrency.nativeElement.value
      if (homeCurrencyType == 'EGP') {
        value.currency = 1;
      } else if (homeCurrencyType == 'US') {
        value.currency = 2;
      } else {
        value.currency = 3;
      }
    } else {
      value.is_home_visit = 0
    }
    if (this.isVideoConsult == true) {
      value.is_video_call = 1;
      let videoCurrencyType = this.videoCallCurrency.nativeElement.value
      if (videoCurrencyType == 'EGP') {
        value.video_call_currency = 1;
      } else if (videoCurrencyType == 'US') {
        value.video_call_currency = 2;
      } else {
        value.video_call_currency = 3;
      }
      value.fees_video_call = this.videoCallfees.nativeElement.value;
      value.video_selected_days = this.selected_days;
      value.video_from = this.videoFrom.nativeElement.value.toLowerCase();
      value.video_to = this.videoTo.nativeElement.value.toLowerCase();
    } else {
      value.is_video_call = 0
    }
    this.newItemEvent.emit({ ...value });
  }
  newItemEventCo(value: any) {
    //debugger
    if (this.isHomeVisit == true) {
      value.is_home_visit = 1
      // value.fees_home_visit= this.homeVisitfees.nativeElement.value;
      value.currency = 1;
      // let homeCurrencyType = this.homeVisitCurrency.nativeElement.value;
      // this.ConsultationData.controls['homeVisit'].setValidators([Validators.required]);

      if (this.homeVisitfees != undefined) {
        value.fees_home_visit = this.homeVisitfees.nativeElement.value;

      } else {
        value.fees_home_visit = ''
      }
      value.currency = 1;
      let homeCurrencyType = "EGP"
      if (this.homeVisitCurrency != undefined) {
        homeCurrencyType = this.homeVisitCurrency.nativeElement.value
      }
      if (homeCurrencyType == 'EGP') {
        value.currency = 1;
      } else if (homeCurrencyType == 'US') {
        value.currency = 2;
      } else {
        value.currency = 3;
      }
    } else {
      // this.ConsultationData.controls['homeVisit'].clearValidators();
      value.is_home_visit = 0
    }
    if (this.isVideoConsult == true) {
      value.is_video_call = 1;
      let videoCurrencyType = "EGP"
      // this.ConsultationData.controls['videoCall'].setValidators([Validators.required]);

      if(this.videoCallCurrency != undefined) {
         videoCurrencyType = this.videoCallCurrency.nativeElement.value

      }
      if (videoCurrencyType == 'EGP') {
        value.video_call_currency = 1;
      } else if (videoCurrencyType == 'US') {
        value.video_call_currency = 2;
      } else {
        value.video_call_currency = 3;
      }
      if(this.videoCallfees != undefined) {
        value.fees_video_call = this.videoCallfees.nativeElement.value;

      }
      let unique = (src:any) => [...new Set(src)];
      this.selected_days = unique(this.selected_days);
      value.video_selected_days = this.selected_days;
      if(this.videoFrom != undefined) {
        value.video_from = this.videoFrom.nativeElement.value.toLowerCase();

      }
      if(this.videoTo != undefined) {
        value.video_to = this.videoTo.nativeElement.value.toLowerCase();

      }
    } else {
      value.is_video_call = 0
      // this.ConsultationData.controls['videoCall'].clearValidators();
    }
    this.newItemEventCon.emit({ ...value });
  }

  addDay(e: any) {
    //debugger
    //console.log("daaaay", e.target.classList[1])
    if (e.target.classList[1] == undefined) {
      e.target.classList.add('active')
      this.selected_days.push(e.target.dataset.value);
    } else {
      if (this.selected_days.length > 1) {
        // let itemRemovedIndex = this.selected_days.indexOf(e.target.dataset.value);

        this.selected_days = this.selected_days.filter((ele:any) => ele !== e.target.dataset.value);
        this.selected_days = this.selected_days.filter((ele:any) => ele.toLowerCase() !== e.target.dataset.value.toLowerCase());
        // if (itemRemovedIndex != -1) {
        //   this.selected_days.splice(itemRemovedIndex, 1)
        // }
        e.target.classList.remove('active')
      }

    }
    if(this.editMode == true) {
      this.newItemEventCo(this.stepThreeObject)

    } else {
      this.addNewItem(this.stepThreeObject)
    }
  }
  homeCheck() {
    var homeCheckBox = <HTMLInputElement>document.getElementById("homeCheck");
    // If the checkbox is checked, display the output text
    if (homeCheckBox.checked == true) {
      this.isHomeVisit = true

    } else {
      this.isHomeVisit = false
    }
  }
  videoCheck() {
    var vedioCheckBox = <HTMLInputElement>document.getElementById("videoCheck");
    // If the checkbox is checked, display the output text
    if (vedioCheckBox.checked == true) {
      this.isVideoConsult = true
    } else {
      this.isVideoConsult = false
    }
  }


  removeValidators($event:any){
    if(this.editMode){
      if(!$event.target.checked){
        this.ConsultationData.controls['homeVisit'].clearValidators();
        this.ConsultationData.controls['homeVisit'].updateValueAndValidity();
      } else {
        this.ConsultationData.controls['homeVisit'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero()]);
        this.ConsultationData.controls['homeVisit'].updateValueAndValidity();
      }
    }
    
  }
  removeValidators2($event:any){
    if(this.editMode){
      if(!$event.target.checked){
        this.ConsultationData.controls['videoCall'].clearValidators();
        this.ConsultationData.controls['videoCall'].updateValueAndValidity();
        this.ConsultationData.controls['videoFrom'].clearValidators();
        this.ConsultationData.controls['videoFrom'].updateValueAndValidity();
        this.ConsultationData.controls['videoTo'].clearValidators();
        this.ConsultationData.controls['videoTo'].updateValueAndValidity();
      } else {
        this.ConsultationData.controls['videoCall'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero(),this.validatorService.minValueError()]);
        this.ConsultationData.controls['videoCall'].updateValueAndValidity();
        this.ConsultationData.controls['videoFrom'].setValidators([Validators.required]);
        this.ConsultationData.controls['videoFrom'].updateValueAndValidity();
        this.ConsultationData.controls['videoTo'].setValidators([Validators.required]);
        this.ConsultationData.controls['videoTo'].updateValueAndValidity();
      }
    }
    
  }

  removeValidators4($event:any){
      if(!$event.target.checked){
        this.ConsultationData.controls['videoCall'].clearValidators();
        this.ConsultationData.controls['videoCall'].updateValueAndValidity();
        this.ConsultationData.controls['videoFrom'].clearValidators();
        this.ConsultationData.controls['videoFrom'].updateValueAndValidity();
        this.ConsultationData.controls['videoTo'].clearValidators();
        this.ConsultationData.controls['videoTo'].updateValueAndValidity();
      } else {
        this.ConsultationData.controls['videoCall'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero(),this.validatorService.minValueError()]);
        this.ConsultationData.controls['videoCall'].updateValueAndValidity();
        this.ConsultationData.controls['videoFrom'].setValidators([Validators.required]);
        this.ConsultationData.controls['videoFrom'].updateValueAndValidity();
        this.ConsultationData.controls['videoTo'].setValidators([Validators.required]);
        this.ConsultationData.controls['videoTo'].updateValueAndValidity();
      }
    
  }

  removeValidators3($event:any){
    if(!$event.target.checked){
      this.ConsultationData.controls['homeVisit'].clearValidators();
      this.ConsultationData.controls['homeVisit'].updateValueAndValidity();
    } else {
      this.ConsultationData.controls['homeVisit'].setValidators([Validators.required,RxwebValidators.digit(),this.validatorService.notEqualZero()]);
      this.ConsultationData.controls['homeVisit'].updateValueAndValidity();
    }
  
}


noSpacesEvent($event : any){
  this.validatorService.noSpacesEvent($event);
}

allowOnlyNumber($event : any){
  this.validatorService.allowOnlyNumber($event);
}


}
