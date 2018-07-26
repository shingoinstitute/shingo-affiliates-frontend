// tslint:disable:prefer-const

import { Injector } from '@angular/core';
import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService, CookieModule } from 'ngx-cookie';

import { APIHttpService } from './http.service';
import { HttpRequest } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture } from '@angular/core/testing';


describe('HttpService', () => {

  let injector: Injector;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIHttpService],
      imports: [
        HttpClientTestingModule,
        CookieModule.forRoot()
      ]
    });

    injector = getTestBed();
    cookieService = injector.get(CookieService);

  });

  it('should be created', inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    expect(http).toBeTruthy();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
    expect(http.put).toBeDefined();
    expect(http.delete).toBeDefined();
    expect(http.request).toBeDefined();
    expect(http.removeToken).toBeDefined();
  }));

  it('expects a GET request', inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    // Make an HTTP GET request, and expect that it return an object
    // of the form {name: 'Test Data'}.
    http
    .get('/workshop')
    .subscribe(data => expect(data['name']).toEqual('Test Data'));

    // At this point, the request is pending, and no response has been
    // sent. The next step is to expect that the request happened.
    const req = httpMock.expectOne('/workshop');

    // If no request with that URL was made, or if multiple requests match,
    // expectOne() would throw. However this test makes only one request to
    // this URL, so it will match and return a mock request. The mock request
    // can be used to deliver a response or make assertions against the
    // request. In this case, the test asserts that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Next, fulfill the request by transmitting a response.
    req.flush({ name: 'Test Data' });

    // Finally, assert that there are no outstanding requests.
    httpMock.verify();
  }));

  it('expects a POST request', inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    http
    .post('/data', { name: 'Test Name' })
    .subscribe(data => expect(data['name']).toEqual('Test Name'));

    const req = httpMock.expectOne('/data');

    expect(req.request.method).toEqual('POST');

    req.flush({ name: 'Test Name' });

    httpMock.verify();
  }));

  it('expects a PUT request', inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    http
    .put('/data', { id: '123', name: 'old name' })
    .subscribe(data => {
      expect(data['id']).toEqual('123');
      expect(data['name']).toEqual('new name');
    });

    const req = httpMock.expectOne('/data');

    expect(req.request.method).toEqual('PUT');

    req.flush({ id: '123', name: 'new name' });

    httpMock.verify();
  }));

  it('expects a DELETE request',
    inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    http
    .delete('/data/123')
    .subscribe(data => expect(data['success']).toEqual('true'));

    const req = httpMock.expectOne('/data');

    expect(req.request.method).toEqual('DELETE');

    req.flush({success: 'true'});

    httpMock.verify();
  }));

  it('expects to make an HTTP Request',
    inject([APIHttpService, HttpTestingController], (http: APIHttpService, httpMock: HttpTestingController) => {
    const httpRequest: HttpRequest<any> = new HttpRequest<any>('GET', '/testurl');

    http
      .request(httpRequest)
      .subscribe((res: HttpResponse<any>) => {
        if (res instanceof HttpResponse) {
          expect(res.body['success']).toEqual('true');
        }
      });

      const req = httpMock.expectOne('/testurl');

      expect(req.request.method).toEqual(httpRequest.method);

      req.flush({success: 'true'});

      httpMock.verify();
  }));

  it('can set and remove jwt token from cookies', inject([APIHttpService], (http: APIHttpService) => {
    // set a cookie with cookieService
    cookieService.put('x-jwt', 'mocktoken');

    // check that `jwt` returns the value stored in cookie service
    expect(http.jwt).toEqual('mocktoken');

    // remove the token
    http.removeToken();

    // check that `jwt` property returns null
    expect(http.jwt).toEqual(null);
    // check that the token was actually removed from the cookie service
    expect(cookieService.get('x-jwt')).toEqual(undefined);
  }));

});
