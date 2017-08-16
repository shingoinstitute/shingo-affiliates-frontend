import { TestBed, inject } from '@angular/core/testing';

import { AffiliateService } from './affiliate.service';

describe('AffiliateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AffiliateService]
    });
  });

  it('should be created', inject([AffiliateService], (service: AffiliateService) => {
    expect(service).toBeTruthy();
  }));
});
