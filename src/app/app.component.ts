import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { SplashComponent } from './core/components/splash/splash.component';
import { FirebaseService } from './core/_services/firebase.service';
import { LoadingService } from './core/_services/loading.service';
import { ValidatorsService } from './core/_services/validators.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { LayoutService } from './core/_services/layout.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'new-project';
  splash: boolean = true;
  mdq!: MediaQueryList;



  showMobileApps = false;

  mediaQueryListener:()=>void;

  constructor(
    private _loadingService : LoadingService,
    private _router : Router,
    private _validatorsService : ValidatorsService,
    private _firebaseService : FirebaseService,
    private media : MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private layoutService : LayoutService
    ){
      
      this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(res=>{
        setTimeout(() => {
          this.splash = false;
        }, 3000);
      });

      

    

      window.onpopstate = (event : any) => {
        this._router.events
        .pipe(
          filter(event => event instanceof NavigationEnd)
        )
        .subscribe((res:any)=>{
          if(res.url.indexOf("DoctorRegister") > -1 || res.url.indexOf("SignIn") > -1){
            this.removeAllCookiesData();
            this._router.navigate(['/auth/SignIn']);
          }
        })
      }

    

    // show mobile apps screen
    this.mdq = media.matchMedia('(min-width: 1200px)');

    this.mediaQueryListener = () => {
      changeDetectorRef.detectChanges();
       this.layoutService.menuFlag.next(false)
    }
    this.mdq.addEventListener('change',this.mediaQueryListener);

    window.addEventListener('load',this.mediaQueryListener)

    // show mobile apps screen

     

  }



  $currentMessage = this._firebaseService.currentMessage;



  removeAllCookiesData() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toLocaleString();
    document.cookie = 'userToken' + '=' + ''+ ';expires=' + expires + ';path=/';
    document.cookie = 'userStatus' + '=' +  '' + ';expires=' + expires + ';path=/';
  }
  

  $loadingSpinner = this._loadingService.loadingSpinner;



}
