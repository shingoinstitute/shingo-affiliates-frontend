import { TestBed, inject } from '@angular/core/testing';

import { WorkshopFilterFactory } from './workshop-filter-factory.service';

describe('WorkshopFilterFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopFilterFactory]
    });
  });

  it('should be created', inject([WorkshopFilterFactory], (service: WorkshopFilterFactory) => {
    expect(service).toBeTruthy();
  }));
});
