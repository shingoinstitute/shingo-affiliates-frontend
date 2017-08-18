// Angular Modules
import { Injectable, EventEmitter } from '@angular/core';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseService } from '../base.abstract.service';
import { User } from '../../shared/models/User';

// RxJS Modules
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

// RxJS operators
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthService extends BaseService {

  private _user: User;
  private get authHost(): string { return `${this.BaseUrl}:${this.BasePort}/auth` }

  protected BaseUrl: string = 'http://192.168.0.136';
  protected BasePort: string = '8080';

  public authenticationChange$: BehaviorSubject<boolean>;
  public get user() { return this._user; }

  constructor(private http: HttpService) {
    super();
    this.authenticationChange$ = new BehaviorSubject<boolean>(!!this.http.jwt);
  }

  /**
    * Logs in the user after succesful authentication with email and password
    * 
    * @param {{ email: string, password: string }} payload 
    * @returns {Observable<any>} 
    * @memberof AuthService
    */
  public login(paylod: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.authHost}/login`, paylod)
      .map(res => {
        const data = res.json();
        this._user = new User(data);
        this.http.jwt = data.jwt;
        this.authenticationChange$.next(res.status === 200);
        return data;
      })
      .catch(err => Observable.throw(err));
  }

  /**
      * Logs the user out and removes their JWT token.
      * 
      * @returns {Observable<void>} 
      * @memberof AuthService
      */
  public logout(): Observable<any> {
    return this.http.get(`${this.authHost}/logout`)
      .map((res: Response) => {
        let data = res.json();
        this._user = null;
        this.http.removeToken();
        this.authenticationChange$.next(false);
        return data;
      })
      .catch(err => Observable.throw(err));
  }

  /**
    * Checks to see if user is authenticated. The user is authenticated if
    * the server returns a 200 response.
    * 
    * @returns {BehaviorSubject<boolean>} 
    */
  public userIsValid(): void {
    if (!this.http.jwt)
      return this.authenticationChange$.next(false);

    this.http.get(`${this.authHost}/valid`)
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe((res: Response) => {
        let data: any = res.json();
        this._user = new User(data);
        this.authenticationChange$.next(res.status === 200);
      }, (err: Response | any) => {
        this._user = null;
        this.authenticationChange$.next(err.json ? err.json() : err);
      });
  }

  /**
   * @description Sends request to server to send password reset link to specified email address
   * @todo Implement actual API route for sending password reset email
   */
  sendPasswordReset(email: string): Observable<any> {
    return this.http.get(`${this.authHost}/resetpassword`)
      .map(res => { return res.json(); })
      .catch(err => { return Observable.throw(err); });
  }
}
