import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loadingSpinner = new BehaviorSubject<boolean>(false);

  constructor() { }


}
