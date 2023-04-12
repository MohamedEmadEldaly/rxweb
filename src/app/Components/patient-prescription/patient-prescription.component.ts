import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-patient-prescription',
  templateUrl: './patient-prescription.component.html',
  styleUrls: ['./patient-prescription.component.scss']
})
export class PatientPrescriptionComponent implements OnInit {

  constructor() { }
  @Output() newItemEvent = new EventEmitter<any>();
  ngOnInit(): void {
  }


  addNewItem() {
    this.newItemEvent.emit('appointments');
  }

}
