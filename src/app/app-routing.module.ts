import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Path } from '@progress/kendo-drawing';
import { AppointmentsComponent } from './Components/appointments/appointments.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { PatientsComponent } from './Components/patients/patients.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { WelcomeCardComponent } from './auth/welcome-card/welcome-card.component';
import { HomeComponent } from './Home/home/home.component';
import { PatientPrescriptionComponent } from './Components/patient-prescription/patient-prescription.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ConsultationComponent } from './consultation/consultation.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  
  {
   path:'auth',
   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
  },
  {
    path: 'Home', component: HomeComponent, children: [
      { path: '', redirectTo: 'Patients', pathMatch: 'full' },
      { path: 'Patients', component: PatientsComponent },
      { path: 'Appointments', component: AppointmentsComponent },
      { path: 'Notifications', component: NotificationsComponent },
      { path: 'Messages', component: MessagesComponent },
      { path: 'Contact', component: ContactusComponent },
      { path: 'About', component: AboutusComponent },
      {path: 'Consultation', component: ConsultationComponent }
      ,
      {
        path: 'Profile', component: ProfileComponent, children: [
          { path: 'Patients',  component: PatientsComponent }
        ]
      }
    ]
  },
  {
    path:'**',
    redirectTo:"auth"
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
