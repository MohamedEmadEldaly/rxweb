import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core/core.module';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SigninComponent } from './signin/signin.component';
import { StepFifthComponent } from './RegisterSteps/step-fifth/step-fifth.component';
import { StepFourthComponent } from './RegisterSteps/step-fourth/step-fourth.component';
import { StepTwoComponent } from './RegisterSteps/step-two/step-two.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AuthComponent,
    WelcomeCardComponent,
    SigninComponent,
    SignUpComponent,
    DoctorRegisterComponent,
    PrivacyPolicyComponent,
    ResetPasswordComponent,
    StepFourthComponent,
    StepFifthComponent,
    StepTwoComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    CoreModule,
  ]
})
export class AuthModule { }
