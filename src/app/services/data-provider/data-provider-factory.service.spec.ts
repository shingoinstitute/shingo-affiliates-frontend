import { TestBed, inject } from '@angular/core/testing';

import { DataProviderFactory } from './data-provider-factory.service';

describe('DataProviderFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataProviderFactory]
    });
  });

  // it('should be created', inject([DataProviderFactory], (service: DataProviderFactory) => {
  //   expect(service).toBeTruthy();
  // }));
});
