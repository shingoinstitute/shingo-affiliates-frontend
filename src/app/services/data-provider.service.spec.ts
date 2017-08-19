import { TestBed, inject } from '@angular/core/testing';

import { WorkshopDataProviderService } from './workshop-data-provider.service';

describe('WorkshopDataProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopDataProviderService]
    });
  });

  it('should be created', inject([WorkshopDataProviderService], (service: WorkshopDataProviderService) => {
    expect(service).toBeTruthy();
  }));
});
