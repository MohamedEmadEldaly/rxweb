import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileScreenComponent } from './mobile-screen.component';

describe('MobileScreenComponent', () => {
  let component: MobileScreenComponent;
  let fixture: ComponentFixture<MobileScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
