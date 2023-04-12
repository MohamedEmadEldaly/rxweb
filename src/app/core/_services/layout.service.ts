import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  menuFlag = new BehaviorSubject<boolean>(false);

  constructor() { }
}
