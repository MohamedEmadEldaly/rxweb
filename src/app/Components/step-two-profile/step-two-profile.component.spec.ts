import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoProfileComponent } from './step-two-profile.component';

describe('StepTwoProfileComponent', () => {
  let component: StepTwoProfileComponent;
  let fixture: ComponentFixture<StepTwoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepTwoProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
