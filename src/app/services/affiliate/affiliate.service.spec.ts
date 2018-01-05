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
import { HttpServiceMock } from '../http/http-service-mock';


import { verify, instance, anyString, anything } from 'ts-mockito';
import { HttpModule } from '@angular/http/src/http_module';

describe('AffiliateService', () => {

  let mockAffiliates = [
    new Affiliate({ Id: 'some sf id 1' }),
    new Affiliate({ Id: 'some sf id 2' })
  ];

  // No need to use the Angular TestBed
  // as we simply can inject the mock 
  // ourselves (we don't care about it Singletonness)
  let service: AffiliateService;
  let mockHttp : HttpServiceMock;
  beforeEach(() => {
    mockHttp = new HttpServiceMock(mockAffiliates);
    service = new AffiliateService(instance(mockHttp.mock));
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
      expect(res[0].sfId).toBe(mockAffiliates[0].sfId);
      expect(res[1].sfId).toBe(mockAffiliates[1].sfId);
      verify(mockHttp.mock.get(anyString())).once();
    });
  });

  // We should get back the first "mock" affiliate
  it('should get an affiliate by id', () => {
    mockHttp.init(mockAffiliates[0]);
    service.http = instance(mockHttp.mock);
    
    service.getById('some sf id 1').subscribe((res: any) => {
      expect(res).not.toBeUndefined();
      expect(res.sfId).toBe(mockAffiliates[0].sfId);
      verify(mockHttp.mock.get(anyString())).once();
    });
  });

  // We should be able to create some affiliate
  it('should create an affiliate', () => {
    const test = new Affiliate({ Name: 'test aff' });
    service.create(test).subscribe(res => {
      expect(res).not.toBeUndefined();
      verify(mockHttp.mock.post(anyString(), anything())).once();
    });
  });

  it('should update an affiliate', () => {
    const test = new Affiliate({ Name: 'test aff', Id: 'some sf id' });

    service.update(test).subscribe(res => {
      expect(res).not.toBeUndefined();
      verify(mockHttp.mock.put(anyString(), anything())).once();
    });
  });

  it('should delete an affiliate', () => {
    const test = new Affiliate({ Name: 'test aff', Id: 'someId' });

    service.delete(test).subscribe(res => {
      expect(res).not.toBeUndefined();
      verify(mockHttp.mock.delete(anyString())).once();
    });
  });

  it('should be able to search for an affiliate', () => {

    service.search("test").subscribe((res: Affiliate[]) => {
      expect(res).not.toBeUndefined();
      expect(res.length).toBe(2);
      verify(mockHttp.mock.get(anyString(), anything())).once();
    });
  });

});
