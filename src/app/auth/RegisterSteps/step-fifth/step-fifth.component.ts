import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatorsService } from 'src/app/core/_services/validators.service';

@Component({
  selector: 'register-step-fifth',
  templateUrl: './step-fifth.component.html',
  styleUrls: ['./step-fifth.component.scss']
})
export class StepFifthComponent implements OnInit {

  constructor(private validatorsService : ValidatorsService) { }
  @Input() public doctorCode!: FormGroup;
  @ViewChild('codeOne') codeOne: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild('codeTwo') codeTwo: any;
  @ViewChild('codeThree') codeThree: any;
  @ViewChild('codeFour') codeFour: any;
  
  doctorCodeValue:any= {
    access_code: ''
  }

  ngOnInit(): void {
  }

  addNewItem(value: any) {
   value.access_code =   this.codeOne.nativeElement.value + this.codeTwo.nativeElement.value+ this.codeThree.nativeElement.value+ this.codeFour.nativeElement.value ;
    this.newItemEvent.emit({...value});
  }

  allowOnlyNumber(event : any){    
    this.validatorsService.allowOnlyNumber(event);
  }

}
