import { ElementRef, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
// import { Service } from '@anservice';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChildActivationEnd } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ValidatorsService } from 'src/app/core/_services/validators.service';


@Component({
  selector: 'app-step-two-profile',
  templateUrl: './step-two-profile.component.html',
  styleUrls: ['./step-two-profile.component.scss']
})
export class StepTwoProfileComponent implements OnInit {

  // @Input() public personalDetails: FormGroup;
  personalDetails: FormGroup;
  @Input() public selectedClinicData: any;
  @Input() public isAddClinicFinish: any;
  @Input() public markedAllTouched: any;
  @Input() public doctorClinisDataBind: any;
  @Input() public editMode: boolean = false;
  daties: any = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<any>();
  @ViewChild("clinicName") clinicName: any;
  // @ViewChild('clinicName', {static: true}) clinicName!: ElementRef;
  @ViewChild('clinicPhone') clinicPhone: any;
  // @ViewChild('from') from: any;
  // @ViewChild('to') to: any;
  @ViewChild('currrencyType') currrencyType: any;
  @ViewChild('regularFee') regularFee: any;
  @ViewChild('urgentFee') urgentFee: any;
  @ViewChild('consulto') consulto: any;
  @ViewChild('countryCode') countryCode: any;


  currentValue! : any ;

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;

    const isValid = !isWhitespace;

    return isValid ? null : { 'whitespace': true };
  }
  constructor(private validatorsService : ValidatorsService) {

    this.personalDetails = new FormGroup({
      clinicName: new FormControl('', [Validators.required,]),
      clinicPhone: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      regularFee: new FormControl('', [Validators.required,RxwebValidators.digit(),this.validatorsService.notEqualZero()]),
      consultation: new FormControl('', [RxwebValidators.digit(),this.validatorsService.notEqualZero()]),
      urgent : new FormControl('', [RxwebValidators.digit(),this.validatorsService.notEqualZero()]),
      // cityName: new FormControl('', [Validators.required]),
      // cityTo: new FormControl('', [Validators.required]),
    })


  }

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  lat! : any;
  lng! :any;

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
  ngOnChanges(changes: SimpleChanges) {
    //
    // ////console.log(changes, changes.isAddClinicFinish, changes.isAddClinicFinish.currentValue);
    if (changes.isAddClinicFinish != undefined) {
      if (changes.isAddClinicFinish.previousValue != undefined) {
        setTimeout(() => {
          this.resetAllInputs();
        }, 50)
      }
    }
    //debugger
    if (changes.markedAllTouched != undefined) {
      if (changes.markedAllTouched.previousValue != undefined) {
        if (this.editMode == false) {
          this.personalDetails.markAllAsTouched()
          // this.currentGroup.markAllAsTouched();
        }
      }
    }
  }

  selectedFromValue: any = '';
  selectedToValue: any = '';

  handleSelectedFrom(date: any) {
    //debugger
    if (date == this.selectedFromValue) {
      return true
    } else {
      return false
    }
  }

  handleSelectedTo(date: any) {
    if (date == this.selectedToValue) {
      return true
    } else {
      return false
    }
  }

  resetAllInputs() {
    ////console.log("resetAllInputs resetAllInputs ", this.selectedToValue, this.selectedFromValue)

    this.clinicName.nativeElement.value = '';
    this.regularFee.nativeElement.value = '';
    this.urgentFee.nativeElement.value = '';
    this.consulto.nativeElement.value = '';
    this.personalDetails.reset();
    this.selected_days = ['Sunday'];
    // this.personalDetails.controls.cityName.setValue('');
    this.stepTwoObject.selected_days = ['Sunday'];
    this.selectedToValue = ''
    this.selectedFromValue = ''

    ////console.log("resetAllInputs resetAllInputs ", this.selectedToValue, this.selectedFromValue)
    // this.personalDetails.form?.controls.dateFrom.setValue('');
    // this.personalDetails.value.controls.dateTo.setValue('');
    // (<Control>form.controls[name]).updateValue('');




  }

  selected_days: any = ['Sunday']

  @Input() item: any; // decorate the property with @Input()
  phoneNumberBind: any = ''

  selectedClinicDataName: any = {
    "id": 10,
    "name": "",
    "phone": "",
    "address": "",
    "country_code": null,
    "currency": "1",
    "is_24": null,
    "fees_regular": '',
    "fees_urgent": '',
    "fees_recheck": '',
    "from": "",
    "to": "",
    "selected_days": [],
    "availability": 1,
    "available_dates": []
  };

  fees_urgent : any;
  fees_recheck : any;
  //PhoneNumberFormat.National
  ngOnInit(): void {
    // this.doctorClinisDataBind = []
    ////console.log(this.item)
    //debugger
    // ////console.log("editMode", this.editMode, this.editModeData, this.doctorClinisDataBind.length)
    if (this.editMode == true) {
      setTimeout(() => {
        // console.log( this.selectedClinicData)
        ////console.log("selectedClinicData", this.selectedClinicData)
        this.selected_days = this.selectedClinicData.selected_days;
        this.phoneNumberBind = this.selectedClinicData.phone;
        // console.log(this.phoneNumberBind)
        this.selectedClinicDataName = this.selectedClinicData.name;
        // this.selectedToValue = this.selectedClinicData.to.toUpperCase();
        // this.selectedFromValue = this.selectedClinicData.from.toUpperCase();
        // this.personalDetails.controls.cityName.setValue(this.selectedFromValue);
        // this.personalDetails.controls.cityTo.setValue(this.selectedToValue);
        this.personalDetails.controls.clinicPhone.setValue(this.selectedClinicData.phone);
        this.personalDetails.controls.clinicName.setValue(this.selectedClinicDataName);
        this.personalDetails.controls.regularFee.setValue(this.selectedClinicData.fees_regular);
        this.personalDetails.controls.urgent.setValue(this.selectedClinicData.fees_urgent);
        this.personalDetails.controls.regularFee.setValue(this.selectedClinicData.fees_regular);
        this.personalDetails.controls.consultation.setValue(this.selectedClinicData.fees_recheck);


        if(this.selectedClinicData.selected_days.length > 0){

            // this.personalDetails.patchValue({cityTo:this.selectedClinicData.selected_days[0].to.toUpperCase(),cityName:this.selectedClinicData.selected_days[0].from.toUpperCase()});


            // console.log(this.selectedClinicData.selected_days);

            this.selected_days_new2.map((day,index)=>{
              let itemIndex = 0;
              const isExist = this.selectedClinicData.selected_days.some((item:any,index:any)=>{
                if(item.day == day.day){
                  itemIndex = index;
                }
                return item.day == day.day
              });
              if(isExist){
                this.selected_days_new2[index] = this.selectedClinicData.selected_days[itemIndex];
                this.selected_days_new2[index].selected = true;
              }
            });

        }

     

        // console.log(this.selected_days_new2);

        // this.selected_days_new2.push(...this.selectedClinicData.selected_days);

        // console.log(this.selected_days_new2);
        


        //new
        this.personalDetails.controls.address.setValue(this.selectedClinicData.address);
        //console.log("selected",this.selectedClinicData)
        this.lat = +this.selectedClinicData.lat;
        this.lng = +this.selectedClinicData.lng;
        //new


      }, 1000)
    } else {
      this.getCurrentLocation();
      // this.phoneNumberBind = this.selectedClinicData.country_code + this.selectedClinicData.phone;
      // console.log(this.phoneNumberBind)
      this.selectedToValue = this.selected_days_new[this.selected_days_index].to;
      this.selectedFromValue = this.selected_days_new[this.selected_days_index].from;
    }

    // console.log(this.editMode);

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

  isFirstTime: boolean = true;
  isSecondFormValid: boolean = false;

  addNewItem(value: any) {
    this.currentValue = value;

    if(this.editMode){

      // console.log("if",this.editMode);

      value.clinic_id = this.selectedClinicData.clinic_id;

      value.selected_days = this.selected_days_new2.filter(day => day['selected'] !== false).map(day=>{
        return {day:day['day'],from:day['from'],to:day['to']}
      })

      // console.log( value.selected_days)
      
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

    //debugger
    if (this.isFirstTime == false) {
      //console.log("first time")
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
     
     
      value.lat = this.lat;
      value.lng = this.lng;

      value.address = this.personalDetails.value['address'];

      // if(this.personalDetails.controls['clinicPhone'].value && typeof this.personalDetails.controls['clinicPhone'].value === 'object'){
      //   value.phone = this.personalDetails.controls['clinicPhone'].value['number'].trim().replace(" ","");
      //   value.country_code = this.personalDetails.controls['clinicPhone'].value['dialCode'].split('+')[1]
      // }

      if (this.personalDetails.value.clinicPhone != null) {
        value.phone = this.personalDetails.value.clinicPhone.internationalNumber;

      } else {
        value.phone = ''
      }
     
      
      // value.from = this.from.nativeElement.value.toLowerCase();
      // value.to = this.to.nativeElement.value.toLowerCase();
    //  let unique = (src:any) => [...new Set(src)];
    //  this.selected_days = unique(this.selected_days)
      // this.selected_days = this.selected_days.filter((item: any, index: any) => this.selected_days.indexOf(item) == index);
      // this.selected_days.forEach((ele: any, i: any) => {
      //   value.selected_days[i] = ele
      // })
      // value.selected_days = [...this.selected_days]

      value.fees_regular = this.regularFee.nativeElement.value;
      value.fees_recheck = this.consulto.nativeElement.value;
      value.fees_urgent = this.urgentFee.nativeElement.value;
      value.clinic_id = 1;

     

      ////console.log(this.personalDetails)
      ////console.log("this.personalDetails", this.personalDetails);
      // console.log(this.personalDetails.status == 'VALID')
      if (this.personalDetails.status == 'VALID') {
        this.isSecondFormValid = true;
        this.isFormValid.emit(this.isSecondFormValid);


      } else {
        this.isSecondFormValid = false;
        this.isFormValid.emit(this.isSecondFormValid);

      }
      value.isFormValid = this.isSecondFormValid
      // console.log("value is",value);
      // console.log("value is",value)
      if(!this.editMode){
        value.selected_days = this.selected_days_new.filter(day => day['selected'] !== false).map(day=>{
          return {day:day['day'],from:day['from'],to:day['to']}
        });
      }
     


      // console.log(value)

      delete value.from;
      delete value.to;

      this.newItemEvent.emit({ ...value });
    } else {
      this.isFirstTime = false;
    }


  }

  addDay(e: any) {

    if (e.target.classList[1] == undefined) {
      //debugger
      e.target.classList.add('active')
      if (!this.selected_days.includes(e.target.dataset.value)) {
        this.selected_days.push(e.target.dataset.value);

      }
    } else {
      if (this.selected_days.length > 1) {
        let itemRemovedIndex = this.selected_days.indexOf(e.target.dataset.value);
        if (itemRemovedIndex != -1) {
          this.selected_days.splice(itemRemovedIndex, 1)
        }
        e.target.classList.remove('active')
      }
    }
    this.addNewItem(this.stepTwoObject)
  }


  currentLocation !:string;
  // lat : any;
  // lng:any;
  marker : boolean = false;



  getCurrentLocation(){
    //console.log("current location work")
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

  onChooseLocation(event : any) {
    //console.log("choose location work", +event.coords.lat,+event.coords.lng)
    this.lat = +event.coords.lat;
    this.lng = +event.coords.lng;
    this.marker = true;
    this.addNewItem(this.currentValue)
  }

  allowOnlyNumber($event : any){
    this.validatorsService.allowOnlyNumber($event)
  }

  allowNumbersWithoutZeros($event : any){
    this.validatorsService.allowNumbersWithoutZeros($event)
  }


  latestPhoneNumber:any;
  latestCountryCode:any;

  phoneNumberText(event : any,countryCode?:any){
    this.latestPhoneNumber = event.target.value;
    this.validatorsService.noSpacesEvent(event);
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

   selected_days_new2 = [
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

   isActiveDay2(day : any){
    const selectedDay = this.selected_days_new2.find((item:any) => item['day'] === day)
    return selectedDay?.selected;
  }
 
 

  addNewDay(dayIndex : any){
  //  if(this.selected_days_new[dayIndex].selected && !this.selected_days_new[dayIndex].clicked){
  //      this.personalDetails.patchValue({cityName:this.selected_days_new[dayIndex].from,cityTo:this.selected_days_new[dayIndex].to});
  //      this.selected_days_index = dayIndex;
  //      this.selected_days_new[dayIndex].clicked = true;
  //  } else {
     this.selected_days_new[dayIndex].selected = !this.selected_days_new[dayIndex].selected;
     this.selected_days_index = dayIndex;
    //  this.personalDetails.patchValue({cityName:this.selected_days_new[dayIndex].from,cityTo:this.selected_days_new[dayIndex].to});
  //  }
 }
 
 
   changeFromTime(event:any,index?:any){
    this.selected_days_index = index;
     this.selected_days_new[this.selected_days_index].from = event.target.value;
   }
 
   changeToTime(event:any,index?:any){
    this.selected_days_index = index;
    this.selected_days_new[this.selected_days_index].to = event.target.value;
   } 


   firstClick2 = true;
  //  lastIndex2:any;

   addNewDay2(dayIndex : any){
    // if(this.selected_days_new2[dayIndex].selected && !this.selected_days_new2[dayIndex].clicked){
    //     this.personalDetails.patchValue({cityName:this.selected_days_new2[dayIndex].from,cityTo:this.selected_days_new2[dayIndex].to});
    //     this.selected_days_index = dayIndex;
    //     this.selected_days_new2[dayIndex].clicked = true;
    // } else {
      this.selected_days_new2[dayIndex].selected = !this.selected_days_new2[dayIndex].selected;
      this.selected_days_index = dayIndex;
      // this.personalDetails.patchValue({cityName:this.selected_days_new2[dayIndex].from,cityTo:this.selected_days_new2[dayIndex].to});
      // this.selected_days_new2[dayIndex].clicked = false;
    // }
  }


  changeFromTime2(event:any,index?:any){
    // console.log(index,event.target.value)
    this.selected_days_index = index;
    this.selected_days_new2[this.selected_days_index].from = event.target.value;
  }

  changeToTime2(event:any,index?:any){
    // console.log(index)
    this.selected_days_index = index;
    this.selected_days_new2[this.selected_days_index].to = event.target.value;
  }


  

}
