import { TestBed, inject } from '@angular/core/testing';

import { FacilitatorService } from './facilitator.service';

describe('FacilitatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilitatorService]
    });
  });

  it('should be created', inject([FacilitatorService], (service: FacilitatorService) => {
    expect(service).toBeTruthy();
  }));
});
