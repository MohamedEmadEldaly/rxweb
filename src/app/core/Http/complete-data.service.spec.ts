import { TestBed } from '@angular/core/testing';

import { CompleteDataService } from './complete-data.service';

describe('CompleteDataService', () => {
  let service: CompleteDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompleteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
