import { Component, OnInit, AfterViewInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';

import { FileRestrictions } from '@progress/kendo-angular-upload';
import { RegisterService } from 'src/app/core/Http/register.service';
import { ValidatorsService } from '../../_services/validators.service';

@Component({
  selector: 'register-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements AfterViewInit {
  constructor(private registerServices: RegisterService,private validatorService : ValidatorsService) {  }
  specialties: any = [];
  specialtiesList: any;
  specialtiesSelectedId: any;
  degrees: any = [];
  degreesList: any;
  degreesSelectedId: any;
  specialtiesDegree: object={};
  imageLayerPreview: any;
  show_personal_layer_preview = false;
  isConsoltoParticipate=false;

  stepOneObject={
    image: '',
    speciality_id: 0,
    degre_id: '',
    university: '',
    consolto: 0,
    note:''
  }

  currentDoctorData!:any;

  layer_personal_file: any = "";
  personal_image_file:any;
  public uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  public uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  formDataStepOne = new FormData();

  public restrictions: FileRestrictions = {
    allowedExtensions: ['jpg', 'jpeg', 'png']
  };
  @Output() newItemEvent = new EventEmitter<any>();
  @Input() public doctorDetails!: FormGroup;
  @Input() public personalDoctorInfo: any;
  @Input() public editMode: boolean = false;

  @ViewChild('password') public textbox: TextBoxComponent | undefined;

  @ViewChild('uploadImage') uploadImage: any;
  @ViewChild('image') image: any;
  @ViewChild('university') university: any;
  @ViewChild('note') note: any;
  @ViewChild('specialty') specialty: any;
  @ViewChild('degree') degree: any;

  @ViewChild('consolto') consoltoInput : any;

  doctorConsoltoValue : any;
  noteValue! : any

  ngOnInit(): void {

    //debugger
    //console.log("ediiiiiiiiiiiiiiiiiiiiit mode ", this.editMode, this.personalDoctorInfo);
    if(this.editMode == true) {

      // console.log(this.personalDoctorInfo)

      this.specialtyValue = this.personalDoctorInfo.speciality_en;
      this.degreeValue = this.personalDoctorInfo.degre_en;  // university
      this.universityValue = this.personalDoctorInfo.university;
      this.noteValue = this.personalDoctorInfo.note;


      
      if(this.degreeValue.toLowerCase() == 'proffesor') {
        this.isConsoltoParticipate = true;
        // document.querySelector("#consolto")?.checked= true;
        setTimeout(() =>{
          var consoltoCheck = <HTMLInputElement> document.getElementById("consolto");
          consoltoCheck.checked = this.personalDoctorInfo.consolto === false ? false : true;

        }, 10)

      } else {
        this.isConsoltoParticipate = false;
        this.doctorConsoltoValue = 0;
        // consoltoCheck.checked = false;
      }

      var consoltoCheck = <HTMLInputElement> document.getElementById("consolto");

      // If the checkbox is checked, display the output text
      if(document.getElementById("consolto") != undefined) {
        if (consoltoCheck.checked == true){
          this.currentDoctorData.consolto = 1
        }
      }

      this.currentDoctorData = {
        speciality_id : +this.personalDoctorInfo.speciality_id,
        degre_id :  +this.personalDoctorInfo.degre_id,
        image :  this.personalDoctorInfo.image,
        university :  this.universityValue,
        consolto : this.personalDoctorInfo.consolto === false ? 0 : 1,

      }

      this.newItemEvent.emit(this.currentDoctorData)

    

    }


    this.registerServices.getSpecialitiesList().subscribe((data:any)  => {
      this.specialties =  data.data.specialities.map(function (x: { en_name: any; }) { return x.en_name;});
      this.specialtiesList =  data.data.specialities;
      this.degrees =  data.data.degres.map(function (x: { en_name: any; }) { return x.en_name;});
      this.degreesList= data.data.degres;
    });

  }





  specialtyValue:any = '';
  degreeValue:any = '';
  universityValue:any = '';
  checkSpecialty (spcialty:any) {
    // //debugger
    // if(spcialty == this.personalDoctorInfo.speciality_en) {
    //   return true

    // }
    return false
    // specialty == personalDoctorInfo.speciality_en

  }

  isFirstTime: boolean = true;

  addNewItem(value: any) {
    // let value = 'vaaaalue'

    if(this.editMode === true){
      this.isFirstTime = false
      if(this.isFirstTime == false) {
        this.constructStepOneObject()
      } else {
        this.isFirstTime = false;
      }
    } else {
      if(this.isFirstTime == false) {
        this.constructStepOneObject()
      } else {
        this.isFirstTime = false;
      }
    }
  

    // this.newItemEvent.emit(value);
    // this.newItemEvent.emit(value2);

    // this.currentDoctorData = {
    //   speciality_id : +this.personalDoctorInfo.speciality_id,
    //   degre_id :  +this.personalDoctorInfo.degre_id,
    //   image :  this.personalDoctorInfo.image,
    //   university :  this.universityValue,
    //   consolto : 0
    // }

    if(this.editMode){
      // console.log(this.degreesSelectedId ? true : false)
      // console.log(this.degreesSelectedId ? this.degreesSelectedId : this.currentDoctorData.degre_id)
      value.speciality_id = this.specialtiesSelectedId ? this.specialtiesSelectedId : this.currentDoctorData.speciality_id;
      value.degre_id =  this.degreesSelectedId ? this.degreesSelectedId : this.currentDoctorData.degre_id;
      value.image =  this.personal_image_file ? this.personal_image_file : this.currentDoctorData.image;
      value.university =  this.university.nativeElement.value ? this.university.nativeElement.value : this.currentDoctorData.university;
      value.consolto = 0;
    } else {
      value.speciality_id = this.specialtiesSelectedId;
      value.degre_id =  this.degreesSelectedId;
      value.image =  this.personal_image_file;
      value.university =  this.university.nativeElement.value;
      value.consolto = 0
    }

   

    // console.log("value is",value)

    var consoltoCheck = <HTMLInputElement> document.getElementById("consolto");

    // If the checkbox is checked, display the output text
    if(document.getElementById("consolto") != undefined) {
      if(this.editMode === true){
        if (consoltoCheck.checked == true && this.degreeValue.toLowerCase() === 'proffesor'){
          value.consolto = 1
        }
      } else {
        if (consoltoCheck.checked == true){
          value.consolto = 1
        }
      }
     
    }

    // console.log(value);


    this.newItemEvent.emit({...value});



  }


  noSpaceEvent($event:any){
    this.validatorService.noSpacesEvent($event)
  }

  constructStepOneObject() {

    if(this.personal_image_file != undefined ){
      this.stepOneObject.image= this.personal_image_file;
    }
    this.stepOneObject.university = this.university.nativeElement.value;
    this.stepOneObject.note = this.note.nativeElement.value;

    let selectedSpecialtiesPos = this.specialtiesList.map(function (x: any) {return x.en_name;}).indexOf(this.specialty.nativeElement.value);
    if(selectedSpecialtiesPos != -1) {
      this.specialtiesSelectedId=this.specialtiesList[selectedSpecialtiesPos].id;
      this.stepOneObject.speciality_id = this.specialtiesSelectedId;
    }
    let selectedDegreePos = this.degreesList.map(function (x: any) {return x.en_name;}).indexOf(this.degree.nativeElement.value);
    if(selectedDegreePos != -1) {
      this.degreesSelectedId=this.degreesList[selectedDegreePos].id;
      this.stepOneObject.degre_id = this.degreesSelectedId;
    }

    this.formDataStepOne.append("image",   this.stepOneObject.image );
    this.formDataStepOne.append("speciality_id",   this.stepOneObject.speciality_id.toString() );
    this.formDataStepOne.append("degre_id",   this.stepOneObject.degre_id );
    this.formDataStepOne.append("university",   this.stepOneObject.university );
    this.formDataStepOne.append("note",   this.stepOneObject.note );


    //console.log("imaaaaage value",this.stepOneObject, this.specialty.nativeElement.value);

    // console.log("first time")


  }


  toggleCheck($event : any){
    this.doctorConsoltoValue = $event.target.checked ? 1 : 0;
  }

  
  public ngAfterViewInit(): void {
    let itemRemove = this.textbox?.input.nativeElement.type;
    itemRemove = 'password';
  }

  public toggleVisibility(): void {
    const inputEl = this.textbox?.input.nativeElement;
    inputEl.type = inputEl.type === "password" ? "text" : "password";
  }


  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.show_personal_layer_preview = true;
      let file: File = fileList[0];
      this.personal_image_file = fileList[0];
      let img = document.querySelector("#preview img");
      this.image.file = file;
      var reader = new FileReader();
      reader.onload = (function (aImg: any) { return function (e: any) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }
  onChange(deviceValue: any) {
    //debugger
    let indexOptionSelected: number =  Number(document.querySelector(`option[value ='${deviceValue.target.value}']`)?.getAttribute('id'))
    if (indexOptionSelected == 0) {

     this.isConsoltoParticipate = true

    }else {
      this.isConsoltoParticipate = false
    }
    // document.querySelector('`option[${deviceValue.target}]`')
  }
  constructDropDownList(list: any[]) {
   let newArr = []
   newArr = list.map(function (x) { return x.en_name;})
  }

  // noSpacesEvent($event : any){
  //   console.log($event)
  //   this.validatorService.noSpacesEvent($event);
  // }


}
