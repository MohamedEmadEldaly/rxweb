import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MainSliderComponent } from './components/main-slider/main-slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastComponent } from './components/toast/toast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../Components/loader/loader.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { StepOneComponent } from '../core/components/step-one/step-one.component';
import { StepThreeComponent } from '../core/components/step-three/step-three.component';
import { SplashComponent } from './components/splash/splash.component';

import { LottieModule } from 'ngx-lottie';
import { NextInputDirective } from './directive/next-input.directive';
import { AgmCoreModule } from '@agm/core';

import { NotificationComponent } from './components/notification/notification.component';
import { TextarearesizeDirective } from './directive/textarearesize.directive';
import { MobileScreenComponent } from './components/mobile-screen/mobile-screen.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    MainSliderComponent,
    ToastComponent,
    LoaderComponent,
    StepOneComponent,
    StepThreeComponent,
    SplashComponent,
    NextInputDirective,
    NotificationComponent,
    TextarearesizeDirective,
    MobileScreenComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxIntlTelInputModule,
    RouterModule,
    LayoutModule,
    DateInputsModule,
    DropDownsModule,
    UploadsModule,
    InputsModule,
    LabelModule,
    LottieModule,
    AgmCoreModule,
    
  ],
  exports : [
    LoadingSpinnerComponent,
    MainSliderComponent,
    LoaderComponent,
    ToastComponent,
    CarouselModule,
    NgbModule,
    NgxIntlTelInputModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LayoutModule,
    DateInputsModule,
    DropDownsModule,
    UploadsModule,
    InputsModule,
    LabelModule,
    StepOneComponent,
    StepThreeComponent,
    SplashComponent,
    LottieModule,
    NextInputDirective,
    AgmCoreModule,
    NotificationComponent,
    TextarearesizeDirective,
    MobileScreenComponent
  ]
})
export class CoreModule { }
