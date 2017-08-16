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

  constructor(public http: Http, public _cs: CookieService) { this.jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMTpkdXN0aW4uZS5ob21hbkB1c3UuZWR1OmMyTnllWEIwQUEwQUFBQUlBQUFBQVdRZEVQSStCN3o3a2pXWjlvVk9xR3dlcWN1bjR1R25qQy9EanlISk9xYTJsTEMzTVozMTgzS2hqUkQxV0MwWlJSQnpSUHNQN0ZpNVNoaXJ5Zm9jeG8wQ1hvblJLR0piajlNc0d6K0doaEV4IiwiZXhwaXJlcyI6IjIwMTctMDgtMTdUMTA6Mjg6MDEuNjE2WiJ9.FvGLvVl1JuuXFnWN1crGXts1jOm2fGkrV4Kc_GN7T1U'; }

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
