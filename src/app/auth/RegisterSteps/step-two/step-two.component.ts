import { EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
// import { Service } from '@anservice';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ChildActivationEnd } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ValidatorsService } from 'src/app/core/_services/validators.service';
// /// <reference types="google.maps" />
import {AgmMap, MouseEvent,MapsAPILoader  } from '@agm/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';


@Component({
  selector: 'register-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {
  @Input() public personalDetails!: FormGroup;
  @Input() public selectedClinicData: any;
  @Input() public isAddClinicFinish: any;

  @Input() public doctorClinisDataBind: any;
  @Input() public editMode: boolean = false;
  daties: any = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']
  
  @Output() newItemEvent = new EventEmitter<any>();

  @ViewChild("clinicName") clinicName: any;
  @ViewChild('clinicPhone') clinicPhone: any;
  // @ViewChild('from') from: any;
  // @ViewChild('to') to: any;
  @ViewChild('currrencyType') currrencyType: any;
  @ViewChild('regularFee') regularFee: any;
  @ViewChild('urgentFee') urgentFee: any;
  @ViewChild('consulto') consulto: any;
  @ViewChild('countryCode') countryCode: any;


  @ViewChild('f') private f!: NgForm;

  // f!:FormGroupDirective;



  



  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

 

  stepTwoObject = {
    name: '',
    phone: 0,
    lat: '',
    lng: '',
    address: '',
    // flag:'',
    currency: 1,
    from: '12:00 am',
    to: '12:00 am',
    selected_days: ['Saturday'],
    fees_regular: 100,
    clinic_id: 1,

  }

  ngOnChanges(changes: SimpleChanges) {
    //
    // ////console.log(changes, changes.isAddClinicFinish, changes.isAddClinicFinish.currentValue);
    // console.log(changes.isAddClinicFinish)
    // if(changes.isAddClinicFinish){
    // }
    if (changes.isAddClinicFinish !== undefined) {
      if (changes.isAddClinicFinish.previousValue !== undefined) {
        setTimeout(() => {
          this.resetAllInputs();
        }, 50)
      }
    }


  }
  selectedFromValue: any = '';
  selectedToValue: any = '';

  handleSelectedFrom(date:any) {
    //debugger
    if(date == this.selectedFromValue) {
      return true
    } else {
      return false
    }
  }
  handleSelectedTo(date:any) {
    if(date == this.selectedToValue) {
      return true
    } else {
      return false
    }
  }

  resetAllInputs() {
    ////console.log("resetAllI nputs resetAllInputs ", this.selectedToValue, this.selectedFromValue)
    // console.log("reset")
    this.clinicName.nativeElement.value = '';

    this.regularFee.nativeElement.value = null;
    this.urgentFee.nativeElement.value = null;
    this.consulto.nativeElement.value = null;

    this.personalDetails.controls['urgent'].updateValueAndValidity();
    this.personalDetails.controls['consultation'].updateValueAndValidity();


    this.validateUrgent();


    this.personalDetails.reset();
    setTimeout(() => {
      this.f.resetForm();
    }, 50)


    // this.selected_days = ['Sunday'];
    // this.personalDetails.controls.cityName.setValue('');
    // this.stepTwoObject.selected_days = ['Sunday'];
    // this.selectedToValue = ''
    // this.selectedFromValue = ''

    // this.selected_days_new = [
    //   {day:"Sunday",from:"12:00 AM",to:"01:00 AM",selected:true},
    //   {day:"Monday",from:"12:00 AM",to:"01:00 AM",selected:false},
    //   {day:"Tuesday",from:"12:00 AM",to:"01:00 AM",selected:false},
    //   {day:"Wednesday",from:"12:00 AM",to:"01:00 AM",selected:false},
    //   {day:"Thursday",from:"12:00 AM",to:"01:00 AM",selected:false},
    //   {day:"Friday",from:"12:00 AM",to:"01:00 AM",selected:false},
    //   {day:"Saturday",from:"12:00 AM",to:"01:00 AM",selected:false}
    // ];

    this.selected_days_new = [
      {day:"Sunday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Monday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Tuesday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Wednesday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Thursday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Friday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
      {day:"Saturday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false}
    ]

    this.selected_days_index = 1;

    this.personalDetails.patchValue(
      {
        cityName:this.selected_days_new[this.selected_days_index].from,
        cityTo:this.selected_days_new[this.selected_days_index].to,
      }
    )

    ////console.log("resetAllInputs resetAllInputs ", this.selectedToValue, this.selectedFromValue)
    // this.personalDetails.form?.controls.dateFrom.setValue('');
    // this.personalDetails.value.controls.dateTo.setValue('');
    // (<Control>form.controls[name]).updateValue('');




  }


  validateUrgent(){
    // console.log("validate")
    const consultation = this.personalDetails.controls.consultation.value === null;
      const urgent =  this.personalDetails.controls.urgent.value === null;

      if(consultation){
        this.personalDetails.controls.consultation.clearValidators()
        this.personalDetails.controls.consultation.updateValueAndValidity()
      } else {
        this.personalDetails.controls.consultation.setValidators([RxwebValidators.digit(),this.validatorsService.notEqualZero()]);
        this.personalDetails.controls.consultation.updateValueAndValidity()
      }
      if(urgent){
        this.personalDetails.controls.urgent.clearValidators()
        this.personalDetails.controls.urgent.updateValueAndValidity()
      } else{
        this.personalDetails.controls.urgent.setValidators([RxwebValidators.digit(),this.validatorsService.notEqualZero()]);
        this.personalDetails.controls.urgent.updateValueAndValidity()
      }
  }

  selected_days: any = ['Sunday']

  constructor(private validatorsService : ValidatorsService,private apiloader:MapsAPILoader) {

    // this.service.configObservable.subscribe((value: any) => {
    //   ////console.log("change ",value)
    // })
  }
  @Input() item: any; // decorate the property with @Input()

  ngOnInit(): void {
    // $('select').selectmenu('refresh', true);


    if(!this.editMode){
      this.getCurrentLocation();
      this.selectedToValue = this.selected_days_new[this.selected_days_index].to;
      this.selectedFromValue = this.selected_days_new[this.selected_days_index].from;
    }



    // this.personalDetails = new FormGroup({
    //   regularFee : new FormControl('',[Validators.required])
    // })
    //debugger
    this.doctorClinisDataBind = []
    ////console.log(this.item)
    // ////console.log("editMode", this.editMode, this.editModeData, this.doctorClinisDataBind.length)
    if (this.editMode == true) {
      this.selected_days = this.selectedClinicData.selected_days;
      // this.clinicName.nativeElement.value =  this.selectedClinicData.name;
      // this.regularFee.nativeElement.value=  this.selectedClinicData.fees_regular;
      // this.urgentFee.nativeElement.value=this.selectedClinicData.fees_urgent;
      // this.consulto.nativeElement.value= this.selectedClinicData.fees_recheck;
      this.selectedToValue = this.selectedClinicData.from.toUpperCase();
      this.selectedFromValue = this.selectedClinicData.to.toUpperCase();
      this.personalDetails.controls.clinicPhone.setValue(this.selectedClinicData.phone);

      // if(this.selectedClinicData.currency == '1') {
      //   this.personalDetails.controls.currrencyType.setValue("EGP");
      // } else if(this.selectedClinicData.currency == '2') {
      //   this.personalDetails.controls.currrencyType.setValue("US");
      // } else {
      //   this.personalDetails.controls.currrencyType.setValue("EUR");
      // }

      // this.currrencyType = 'US'
      // this.selected_days = [...new Set(this.selectedClinicData.selected_days)];
    }


  }
  isIncludeDay(day: any) {

    day = day.toLowerCase()
    for (let i = 0; i < this.selected_days.length; i++) {
      if (day == this.selected_days[i].toLowerCase) {
        return true
      }
    }
    return false

  }


  allowOnlyNumber(event : any){    
    this.validatorsService.allowOnlyNumber(event);
  }


  isFirstTime: boolean = true;

  addNewItem(value: any) {

    if(this.isFirstTime == false) {

      let clinicCurrencyType = 'EGP';

      if (this.currrencyType != undefined) {
        clinicCurrencyType = this.currrencyType.nativeElement.value;
        if (clinicCurrencyType == 'EGP') {
          value.currency = 1;
        } else if (clinicCurrencyType == 'US') {
          value.currency = 2;
        } else {
          value.currency = 3
        }
      }

      value.name = this.clinicName.nativeElement.value;
      // value.phone = this.clinicPhone.nativeElement.value;
      if (this.personalDetails.value.clinicPhone != null) {
        value.phone = this.personalDetails.value.clinicPhone.internationalNumber;

      } else {
        value.phone = ''
      }

      value.lat = this.lat;
      value.lng = this.lng;
      
      value.address = this.personalDetails.value['address'];

      // value.flag = this.personalDetails.value['flag'];


      // value.from = this.from.nativeElement.value.toLowerCase();
      // value.to = this.to.nativeElement.value.toLowerCase();

      // this.selected_days.forEach((ele: any, i: any) => {
      //   value.selected_days[i] = ele
      // })

      value.fees_regular = this.regularFee.nativeElement.value;
      value.fees_recheck = this.consulto.nativeElement.value;
      value.fees_urgent = this.urgentFee.nativeElement.value;
      value.clinic_id = 1

      //new days logic

      value.selected_days = this.selected_days_new.filter(day => day['selected'] !== false).map(day=>{
        return {day:day['day'],from:day['from'],to:day['to']}
      })


      //new days logic


      // console.log( value.selected_days)

      // //console.log("value",value)

      this.newItemEvent.emit({ ...value });

    } else {
      this.isFirstTime = false;
    }


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



  //map

  currentLocation !:string;
  lat : any;
  lng:any;
  marker : boolean = false;



  getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {

        this.lat = +position.coords.latitude;
        this.lng = +position.coords.longitude;

        this.marker = true;

        // this.apiloader.load().then(() => {
        //   let geocoder = new google.maps.Geocoder;
        //   let latlng = {lat: this.lat, lng: this.lng};

        //   geocoder.geocode({'location': latlng}, (results : any) => {
        //     if(results){
        //       if (results[0]) {
        //         this.currentLocation= results[0].formatted_address;
        //       } else {
        //         //console.log('Not found');
        //       }
        //     }


        //   });
        // });

  
      }
      })
    }
  
  }

  onChooseLocation(event : any) {
    this.lat = +event.coords.lat;
    this.lng = +event.coords.lng;
    this.marker = true;
  }


  noSpacesEvent($event : any){
    this.validatorsService.noSpacesEvent($event);
  }



  // new days select logic

  selected_days_index:number = 0;

  selected_days_new = [
    {day:"Sunday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Monday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Tuesday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Wednesday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Thursday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Friday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false},
    {day:"Saturday",from:"12:00 AM",to:"01:00 AM",selected:false,clicked:false}
  ]

  isActiveDay(day : any){
    const selectedDay = this.selected_days_new.find((item:any) => item['day'] === day)
    return selectedDay?.selected;
  }


  // firstClick = true;

  addNewDay(dayIndex : any){
    // console.log(dayIndex)
    // if(this.selected_days_new[dayIndex].selected && !this.selected_days_new[dayIndex].clicked){
    //     this.personalDetails.patchValue({cityName:this.selected_days_new[dayIndex].from,cityTo:this.selected_days_new[dayIndex].to});
    //     this.selected_days_index = dayIndex;
    //     this.selected_days_new[dayIndex].clicked = true;
    // } else {
      this.selected_days_new[dayIndex].selected = !this.selected_days_new[dayIndex].selected;
      this.selected_days_index = dayIndex;
      // this.personalDetails.patchValue({cityName:this.selected_days_new[dayIndex].from,cityTo:this.selected_days_new[dayIndex].to});
      // this.selected_days_new[dayIndex].clicked = false;
    // }
  }
  


  // addNewDay(dayIndex : any){
  //   this.selected_days_new[dayIndex].selected = !this.selected_days_new[dayIndex].selected;
  //   this.selected_days_index = dayIndex;
  //   this.personalDetails.patchValue({cityName:this.selected_days_new[dayIndex].from,cityTo:this.selected_days_new[dayIndex].to});
  // }


  changeFromTime(event:any,index:any){
    this.selected_days_index = index;
    this.selected_days_new[this.selected_days_index].from = event.target.value;
  }

  changeToTime(event:any,index:any){
    this.selected_days_index = index;
    this.selected_days_new[this.selected_days_index].to = event.target.value;
  }
  

}
