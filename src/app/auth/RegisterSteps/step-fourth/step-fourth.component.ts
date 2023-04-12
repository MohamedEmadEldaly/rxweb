import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'register-step-fourth',
  templateUrl: './step-fourth.component.html',
  styleUrls: ['./step-fourth.component.scss']
})
export class StepFourthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  signature_layer_preview = false;
  @Input() public signature!: FormGroup;
  @ViewChild('signatureImage') uploadImage: any;
  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild('image') image: any;
  signature_image_file:any;
  stepFourObject={
    image: ''
  }
  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.signature_layer_preview = true;
      let file: File = fileList[0];
      this.signature_image_file = fileList[0];
      let img = document.querySelector(".signature--upload img");
      this.image.file = file;
      var reader = new FileReader();
      reader.onload = (function (aImg: any) { return function (e: any) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }

  addNewItem(value: any) {
    value.signature_image =  this.signature_image_file;

    this.newItemEvent.emit({...value});
  }
}
