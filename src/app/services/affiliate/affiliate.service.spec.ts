import { TestBed, inject } from '@angular/core/testing';

import { AffiliateService } from './affiliate.service';
import { HttpService } from '../http/http.service';

class HttpServiceSpy {

}

const httpService = {

};

describe('AffiliateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AffiliateService/*,*/
        /* { provider: HttpService, useValue: httpService } */
      ]
    });
  });

  // it('should be created', inject([AffiliateService], (service: AffiliateService) => {
  //   expect(service).toBeTruthy();
  // }));

});
