/* tslint:disable */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { CookieService } from 'ngx-cookie';

@Injectable()
export class HttpService {

  public get jwt(): string { return this._cs.get('x-jwt') || null; }

  public set jwt(token: string) { this._cs.put('x-jwt', token); }

  public get _defaultReqOpts() {
    return {
      headers: new HttpHeaders().set('x-jwt', this.jwt || '') || [],
      withCredentials: true,
      observe: 'body',
      responseType: 'json'
    } as any;
  }

  constructor(public http: HttpClient, public _cs: CookieService, private router: Router) { }

  public get<T>(url: string, options = this._defaultReqOpts): Observable<any> {
    return this.http.get<T>(url, options);
  }

  public post<T>(url: string, body: any, options = this._defaultReqOpts): Observable<any> {
    return this.http.post<T>(url, body, options);
  }

  public put<T>(url: string, body: any, options = this._defaultReqOpts): Observable<any> {
    return this.http.put<T>(url, body, options);
  }

  public delete<T>(url: string, options = this._defaultReqOpts): Observable<any> {
    return this.http.delete<T>(url, options);
  }

  public request<T>(req: HttpRequest<any>): Observable<any> {
    console.log('request.serializeBody()', req.serializeBody());
    console.log('requres.detectContentType', req.detectContentTypeHeader());
    return this.http.request<T>(req);
  }

  removeToken() {
    this._cs.remove('x-jwt');
  }

}
