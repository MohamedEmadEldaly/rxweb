import { Component, NgZone, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  animation! : any;
  constructor(private ngZone : NgZone) { }

  ngOnInit(): void {
  }

  options: AnimationOptions = {
    path: 'assets/loader.json',
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
