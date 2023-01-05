import { TestBed } from '@angular/core/testing';

import { UmamiService } from './umami.service';

describe('UmamiService', () => {
  let service: UmamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
