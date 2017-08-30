import { TestBed, inject } from '@angular/core/testing';

import { WorkshopDataSource } from './workshop-data-source.service';

describe('WorkshopDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkshopDataSource]
    });
  });

  it('should be created', inject([WorkshopDataSource], (service: WorkshopDataSource) => {
    expect(service).toBeTruthy();
  }));
});
