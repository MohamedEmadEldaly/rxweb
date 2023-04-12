import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import axios from 'types-axios';
import { ValidatorsService } from '../core/_services/validators.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  contactForm! : FormGroup;
  @ViewChild('messageValue') messageValue: any;
  accessToken : any;
  isLoaderShow : boolean = false;
  messageSend: boolean = false;

  apiUrl = environment.apiUrl;
  
  constructor(
    private toastrService : ToastrService,
    private validatorService : ValidatorsService
  ) { }

  ngOnInit(): void {

    this.contactForm = new FormGroup({
      messageArea : new FormControl('',[Validators.required,Validators.minLength(50)]),
    });

    this.accessToken = this.getCookieDisclaimer("userToken");

    
  }


  sendMessage() {
    this.isLoaderShow = true;

    let message = { message: this.messageValue.nativeElement.value }
    const formData = new FormData();
    formData.append('message', message.message);
    axios({
      url: `${this.apiUrl}doctor-contact-us`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      // ////console.log("reeeeeeeeeeeeeeeee", res);
      this.messageValue.nativeElement.value = ''
      // this.showSuccess(res.data.message);
      this.toastrService.success(res.data.message,"success")
      this.isLoaderShow = false;
      this.contactForm.reset();

    })
    .catch(error =>{
        this.validatorService.handelError(error)
        this.isLoaderShow = false;
    })

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

  changeText() {
    if (this.messageValue.nativeElement.value.trim() != '') {
      this.messageSend = true
    } else {
      this.messageSend = false

    }

  }

}
