import { Component, NgZone, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  animation! : any;
  constructor(private ngZone : NgZone) { }

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
