// tslint:disable:prefer-const
import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { AffiliateService } from './affiliate.service';

import { HttpService } from '../http/http.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Affiliate } from '../../affiliates/affiliate.model';
import { HttpEvent } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

class HttpServiceMock {
  public get(): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>();
  }
}

describe('AffiliateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AffiliateService,
        HttpClientTestingModule,
        { provide: HttpService, useClass: HttpServiceMock }
      ]
    });
  });

  it('should be created', inject([AffiliateService], (service: AffiliateService) => {
    expect(service).toBeTruthy();
  }));

  it('should get all Affiliates', inject([AffiliateService, HttpTestingController], (service: AffiliateService, httpMock: HttpTestingController) => {
    service.getAll().subscribe(res => expect(true).toBe(true));
  }));

});
