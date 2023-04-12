import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFourthComponent } from './step-fourth.component';

describe('StepFourthComponent', () => {
  let component: StepFourthComponent;
  let fixture: ComponentFixture<StepFourthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepFourthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepFourthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
