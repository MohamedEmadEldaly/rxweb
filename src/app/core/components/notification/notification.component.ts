import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseService } from '../../_services/firebase.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  message! : any;
  _unsubscrubeAll = new Subject();

  constructor(private _firebaseService : FirebaseService) { }
  ngOnInit(): void {
    this._firebaseService.currentMessage
    .pipe(takeUntil(this._unsubscrubeAll))
    .subscribe(message =>{
      this.message = message;
    })
  }

  $currentMessage = this._firebaseService.currentMessage;




  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._unsubscrubeAll.next("");
  }



}
