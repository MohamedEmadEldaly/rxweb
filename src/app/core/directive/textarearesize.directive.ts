import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextarearesize]'
})
export class TextarearesizeDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if(!(e.target.value === "")){
      if(e.target.scrollHeight >= 32){
        if(e.keyCode === 32){
          this._el.nativeElement.style.height = ( e.target.scrollHeight - 30 )  + "px";
        } else {
          this._el.nativeElement.style.height = e.target.scrollHeight + "px";
        }
      }
    } else {
      this._el.nativeElement.style.height = "32px"
    }
  }
}
