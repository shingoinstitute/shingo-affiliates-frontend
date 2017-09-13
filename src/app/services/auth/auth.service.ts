// Angular Modules
import { Injectable, EventEmitter } from '@angular/core';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseService } from '../api/base.abstract.service';
import { User } from '../../shared/models/user.model';

// RxJS Modules
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// RxJS operators
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/from';

@Injectable()
export class AuthService extends BaseService {

  public authenticationChange$: BehaviorSubject<boolean>;
  public get user() { return this._user; }

  protected _baseUrl: string = 'https://api.shingo.org/v2/affiliates';
  protected _basePort: string = '8080';

  public _user: User;
  public get authHost(): string { return `${this._baseUrl}/auth`; }

  constructor(public http: HttpService) {
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
    const options = this.http._defaultReqOpts;
    options.observe = 'response';
    return this.http.post<{ email: string, password: string }>(`${this.authHost}/login`, paylod, options)
      .map(res => {
        const data = res.body;
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
    const options = this.http._defaultReqOpts;
    options.observe = 'response';

    return this.http.get(`${this.authHost}/logout`, options)
      .map((data: Response) => {
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

    const options = this.http._defaultReqOpts;
    options.observe = 'response';

    this.http.get<User>(`${this.authHost}/valid`, options)
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(res => {
        const data: any = res.body;
        this._user = new User(data);
        this.authenticationChange$.next(res.status === 200);
      }, res => {
        this._user = null;
        if (res.status === 403) this.authenticationChange$.next(false);
        else {
          console.error('Unknown error in AuthService.userIsValid(): ', res);
          this.authenticationChange$.error(res.json ? res.json() : res);
        }
      });
  }

  /**
   * @desc !! Forces Refresh of user !!
   * 
   * @returns {Observable<User>}
   * @memberof AuthService
   */
  public getUser(): Observable<User> {
    const options = this.http._defaultReqOpts;
    options.headers = options.headers.set('x-force-refresh', 'true');
    options.observe = 'response';
    return this.http.get<User>(`${this.authHost}/valid`, options)
      .map(res => {
        const data = res.body;
        this._user = new User(data);
        return this._user;
      });
  }

  public changeUserPassword(password: string): Observable<any> {
    return this.http.post<User>(`${this.authHost}/changepassword`, { password }).map(res => {
      this.http.jwt = res.jwt;
      return res;
    });
  }

}
