import { TestBed, inject } from '@angular/core/testing';

import { WorkshopFilterFactoryService } from './workshop-filter-factory.service';

describe('WorkshopFilterFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopFilterFactoryService]
    });
  });

  it('should be created', inject([WorkshopFilterFactoryService], (service: WorkshopFilterFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
