import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { applyDefaults } from '../../util/functional';

@Injectable()
export class APIHttpService {

  public get jwt(): string | null { return this._cs.get('x-jwt') || null; }

  public set jwt(token: string) { this._cs.put('x-jwt', token); }

  public get _defaultReqOpts() {
    // We extend the default values for the options object with values for headers and withCredentials.
    return {
      headers: new HttpHeaders().set('x-jwt', this.jwt || ''),
      withCredentials: true
    };
  }

  public readonly post = applyDefaults({ 3: this._defaultReqOpts })(this.http.post);
  public readonly get = applyDefaults({ 2: this._defaultReqOpts })(this.http.get);
  public readonly put = applyDefaults({ 3: this._defaultReqOpts })(this.http.put);
  public readonly delete = applyDefaults({ 2: this._defaultReqOpts })(this.http.delete);
  public readonly request = this.http.request;

  constructor(public http: HttpClient, public _cs: CookieService) { }

  public removeToken() {
    this._cs.remove('x-jwt');
  }

}
