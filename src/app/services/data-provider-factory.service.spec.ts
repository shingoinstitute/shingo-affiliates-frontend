import { TestBed, inject } from '@angular/core/testing';

import { DataProviderFactoryService } from './data-provider-factory.service';

describe('DataProviderFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataProviderFactoryService]
    });
  });

  it('should be created', inject([DataProviderFactoryService], (service: DataProviderFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
