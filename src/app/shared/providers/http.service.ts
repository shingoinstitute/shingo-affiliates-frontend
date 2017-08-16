import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { CookieService } from "ngx-cookie";

export { Headers, RequestOptionsArgs };

@Injectable()
export class HttpService {

  get jwt(): string { return this._cs.get('x-jwt') || null; }

  set jwt(token: string) { this._cs.put('x-jwt', token); }

  private get _defaultReqOpts(): RequestOptionsArgs {
    return {
      headers: new Headers({ 'x-jwt': this.jwt }),
      withCredentials: true
    }
  };

  constructor(public http: Http, public _cs: CookieService) { }

  public get(url: string, options: RequestOptionsArgs = this._defaultReqOpts): Observable<any> {
    return this.http.get(url, options);
  }

  public post(url: string, body: any, options: RequestOptionsArgs = this._defaultReqOpts): Observable<any> {
    return this.http.post(url, body, options);
  }

  public put(url: string, body: any, options: RequestOptionsArgs = this._defaultReqOpts): Observable<any> {
    return this.http.put(url, body, options);
  }

  public delete(url: string, options: RequestOptionsArgs = this._defaultReqOpts): Observable<any> {
    return this.http.delete(url, options);
  }

  removeToken() {
    this._cs.remove('x-jwt');
  }

}
