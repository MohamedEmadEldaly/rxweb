import { Injectable } from '@angular/core';
import { ValidatorFn, FormGroup, ValidationErrors, FormControl, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor(private _toastrService : ToastrService) { }


  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const atIndex = control.value.indexOf("@");
      const dotIndex = control.value.lastIndexOf(".");
      const validEmail = dotIndex > atIndex;
      return validEmail ? null : {validEmail : {value: control.value}};
    }      
  };

  notEqualZero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value === ""){
        return null
      } else {
        const regex = new RegExp('^[1-9][0-9]*$');
        const allowed = regex.test(control.value);
        return allowed ? null : {notZero : {value: control.value}};
      }
      
    }      
  };

  noSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value.trim() !== ""){
        return null
      } else {
        return {haveSpace : {value: control.value}};
      }
    }      
  };

  noSpacesEvent(event : any){
    const value = event.target.value.trim();
    const length = value.length;
    if(length === 0 && event.key === ' '){
      event.preventDefault();
    }
   
  }

  allowOnlyNumber(event : any){
    const allowdBtn = event.keyCode === 8 || event.keyCode === 32 || event.keyCode === 37 || event.keyCode === 39;
    const allowed = event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode === 8 || event.keyCode >= 96 && event.keyCode <= 105;
    allowed || allowdBtn ? "" : event.preventDefault(); 
  }

  allowOnlyEnglish(event : any){
    const arabicRegex = new RegExp('^[\u0621-\u064A\u0660-\u0669 ]+$');
    const allowdBtn = event.keyCode === 8 || event.keyCode === 32 || event.keyCode === 37 || event.keyCode === 39;
    if((arabicRegex.test(event.key) && event.keyCode !== 32)){
      event.preventDefault();
    } else {
      const allowed = event.keyCode >= 65 && event.keyCode <= 90 || allowdBtn;
      if(!allowed){
        event.preventDefault();
      }
    }
    
  }

  allowOnlyArabic(event : any){
    const arabicRegex = new RegExp('^[\u0621-\u064A\u0660-\u0669 ]+$');
    const allowdBtn = event.keyCode === 8 || event.keyCode === 32 || event.keyCode === 37 || event.keyCode === 39;

    if(!(arabicRegex.test(event.key) || allowdBtn)){
      event.preventDefault();
    }
  }

  allowNumbersWithoutZeros(event : any){
      // const regex = new RegExp('^[1-9][0-9]*$');
      // console.log(event.target.value)
      // const allowed = regex.test(event.target.value) || event.target.value === ""
      // console.log(allowed)
      // allowed ? "" : event.preventDefault(); 
  }



  handelError(error:any){
    this._toastrService.error(error.response.data.errors[0],"error");
  }




  minValueError(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = +control.value
      if(controlValue < 50){
        return {minerror : {value: control.value}}
       } else {
         return null
       }
     
    }      
  };
  



  
  
}
