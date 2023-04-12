import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { DoctorRegisterComponent } from "./doctor-register/doctor-register.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SigninComponent } from "./signin/signin.component";
import { WelcomeCardComponent } from "./welcome-card/welcome-card.component";


const authRoutes : Routes = [
    {
        path:'',
        component:AuthComponent,
        children:[
            {path:'', component : WelcomeCardComponent},
            { path: 'SignIn', component: SigninComponent },
            { path: 'SignUp', component: SignUpComponent },
            { path: 'DoctorRegister', component: DoctorRegisterComponent },
            { path: 'PrivacyPolicy', component: PrivacyPolicyComponent },
            { path: "ResetPassword", component: ResetPasswordComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule { }
  