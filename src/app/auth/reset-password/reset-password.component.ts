import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastService } from 'src/app/core/_services/toast.service';
import { AuthenticationService } from 'src/app/core/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/core/_services/validators.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  reactiveForm: FormGroup;

  _unsubscribeAll = new Subject();

  constructor(private fb: FormBuilder,
     public ToastService: ToastService,
     private _authService : AuthenticationService,
     private _toastrService : ToastrService,
     private _router : Router,
     private validatorsService : ValidatorsService
     ) {
    this.reactiveForm = this.fb.group({
        email: ['', [Validators.required, Validators.email,this.validatorsService.emailValidator()]],

       }

    )
  }

  ngOnInit(): void {
  }
  onSubmit() {
    ////console.log("submiiiit", this.reactiveForm.controls, this.reactiveForm.value);
    this.reactiveForm.value.country_code = 20;
    //debugger
    if (this.reactiveForm.status == 'VALID') {
        let sentData = this.reactiveForm.value;
        sentData.email = this.reactiveForm.value.email
        let formData = new FormData()
        formData.append("email",  this.reactiveForm.value.email)

        this.sendRsetPassword(sentData.email);

    } else {
      // this.signupRoute = 'auth/SignUp'
    }


  }
  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }
  isLoaderShow:boolean= false;


  sendRsetPassword(data:any) {
    this.isLoaderShow= true;


    this._authService.resetPassword(data)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res:any)=>{
      this._toastrService.success(res.message,"success");
      this.isLoaderShow= false;
      this._router.navigate(['/auth/SignIn'])
    },(error) => {
      this.isLoaderShow= false;
      this._toastrService.error(error.error.errors[0],"Error");
    })

  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._unsubscribeAll.next("");
  }
}
