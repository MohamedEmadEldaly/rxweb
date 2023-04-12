import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
const ngWizardConfig: NgWizardConfig = {theme: THEME.default};
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'; // <-- #2 import module

import { NgxAgoraSdkNgModule } from 'ngx-agora-sdk-ng';


import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './Home/home/home.component';
import { PatientsComponent } from './Components/patients/patients.component';
import { AppointmentsComponent } from './Components/appointments/appointments.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { SwiperModule } from 'swiper/angular';
import { PatientPrescriptionComponent } from './Components/patient-prescription/patient-prescription.component';
import { StepTwoProfileComponent } from './Components/step-two-profile/step-two-profile.component';

import { AgmCoreModule } from '@agm/core';


import { FormsModule } from '@angular/forms';
// import {MatDatepickerModule, MatInputModule,MatNativeDateModule} from '@angular/material';
// import { AgmCoreModule } from '@agm/core';
// import {google} from '@types/googlemaps';
// import {} from 'google.maps';

// import { AgmCoreModule } from '@agm/core';


import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}



import { interceptors } from './core/interceptors';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ConsultationComponent } from './consultation/consultation.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PatientsComponent,
    AppointmentsComponent,
    NotificationsComponent,
    MessagesComponent,
    ProfileComponent,
    NotFoundComponent,
    PatientPrescriptionComponent,
    StepTwoProfileComponent,
    ContactusComponent,
    AboutusComponent,
    ConsultationComponent
  ],
  imports: [
    NgxAgoraSdkNgModule.forRoot({
      AppID : environment.agora.AppID,
    }),
    // NgxIntlTelInputModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgWizardModule.forRoot(ngWizardConfig),
    HttpClientModule,
    CoreModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    SwiperModule,
    RxReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    LottieModule.forRoot({ player: playerFactory }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCmhwCq8qtR01rwoYk_wzvbkZW1i7LBCEE'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule

   
  ],
  exports: [

  ],
  providers: [...interceptors],
  bootstrap: [AppComponent]
})
export class AppModule { }
