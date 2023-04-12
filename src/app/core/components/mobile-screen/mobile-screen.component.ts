import { Component, NgZone, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-mobile-screen',
  templateUrl: './mobile-screen.component.html',
  styleUrls: ['./mobile-screen.component.scss']
})
export class MobileScreenComponent implements OnInit {

  animation! : any;
  constructor(private ngZone : NgZone) { 
  }

  ngOnInit(): void {
   
  }

  

  options: AnimationOptions = {
    path: 'assets/splash.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animation = animationItem;
  }

  pause(){
    this.ngZone.runOutsideAngular(()=>{
      return this.animation.pause();
    })
  }
}
