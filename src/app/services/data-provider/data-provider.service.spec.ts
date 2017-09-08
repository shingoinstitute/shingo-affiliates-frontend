import { TestBed, inject } from '@angular/core/testing';

import { DataProvider } from './data-provider.service';
import { BaseAPIService } from '../api/base-api.abstract.service';
import { SFObject } from '../../shared/models/sf-object.abstract.model';

describe('WorkshopDataProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataProvider]
    });
  });

  // it('should be created', inject([DataProvider], (service: DataProvider<BaseAPIService, SFObject>) => {
  //   expect(service).toBeTruthy();
  // }));
});
