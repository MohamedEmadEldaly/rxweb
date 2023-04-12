import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNextInput]'
})
export class NextInputDirective {

  constructor(private _el: ElementRef) { }

@HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
        e.preventDefault();
        let nextControl: any = e.srcElement.parentNode.nextElementSibling?.childNodes[0];
       // Searching for next similar control to set it focus
        while (true)
        {
            if (nextControl)
            {
                if (nextControl.type === e.srcElement.type)
                {
                    nextControl.focus();
                    return;
                }
            }
            else
            {
                return;
            }
        }
    }
}

}
