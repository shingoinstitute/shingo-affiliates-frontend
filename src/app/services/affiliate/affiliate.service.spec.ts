// tslint:disable:prefer-const
import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { AffiliateService } from './affiliate.service';

import { HttpService } from '../http/http.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Affiliate } from '../../affiliates/affiliate.model';
import { HttpEvent } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// TODO: Move MockHttpService to http folder
// TODO: Override other functions
// Extend the HttpService so that it can be
// injected into classes that depend on it.
// NOTE: The mocked interface needs to match
// the mockees interface
class HttpServiceMock extends HttpService {

  private mockAffiliates = [
    { Id: 'some sf id' },
    { Id: 'some other sf id' }
  ];

  constructor() { super(null, null); }

  // As get is used to get arrays of and single 
  // instances of Affiliates, return the right one
  public get<T>(url: string): Observable<any> {
    if (url.includes('some sf id')) return Observable.of(this.mockAffiliates[0]);
    return Observable.of(this.mockAffiliates);
  }

  // Post always returns an SFSuccessResponse for Affiliates
  public post<T>(url: string, body: any): Observable<any> {
    return Observable.of({ success: true, id: 'some sf id', errors: [] });
  }
}

describe('AffiliateService', () => {

  // No need to use the Angular TestBed
  // as we simply can inject the mock 
  // ourselves (we don't care about it Singletonness)
  let service: AffiliateService;
  beforeEach(() => {
    service = new AffiliateService(new HttpServiceMock());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAll).not.toBeUndefined();
    expect(service.getById).not.toBeUndefined();
    expect(service.create).not.toBeUndefined();
    expect(service.update).not.toBeUndefined();
    expect(service.delete).not.toBeUndefined();
    expect(service.search).not.toBeUndefined();
    expect(service.searchCMS).not.toBeUndefined();
    expect(service.describe).not.toBeUndefined();
    expect(service.map).not.toBeUndefined();
  });

  // We should get the "mock" affiliates back
  it('should get all Affiliates', () => {
    service.getAll().subscribe(res => {
      expect(res.length).toBe(2);
      expect(res[0]).not.toBeUndefined();
      expect(res[0].sfId).toBe('some sf id');
      expect(res[1].sfId).toBe('some other sf id');
    });
  });

  // We should get back the first "mock" affiliate
  it('should get an affiliate by id', () => {
    service.getById('some sf id').subscribe(res => {
      expect(res).not.toBeUndefined();
      expect(res.sfId).toBe('some sf id');
    });
  });

  // We should be able to create some affiliate
  it('should create an affiliate', () => {
    const test = new Affiliate({ Name: 'test aff' });
    service.create(test).subscribe(res => {
      expect(res).not.toBeUndefined();
      expect(res.id).toBe('some sf id');
    });
  });

});
