import { TestBed, inject } from '@angular/core/testing';

import { WorkshopDataSourceService } from './workshop-data-source.service';

describe('WorkshopDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopDataSourceService]
    });
  });

  it('should be created', inject([WorkshopDataSourceService], (service: WorkshopDataSourceService) => {
    expect(service).toBeTruthy();
  }));
});
