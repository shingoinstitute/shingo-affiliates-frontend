// Angular Modules
import { Facilitator } from '../../facilitators/facilitator.model';
import { Injectable, EventEmitter, isDevMode } from '@angular/core';

// App Modules
import { HttpService } from '../http/http.service';
import { BaseService } from '../api/base.abstract.service';
import { User, UserState } from '../../shared/models/user.model';

// RxJS Modules
import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';

// RxJS operators



@Injectable()
export class AuthService extends BaseService {

  public authenticationChange$: BehaviorSubject<boolean>;
  public get user() { return this._user; }
  public _user: User;

  public get authHost(): string { return `${this._baseUrl}${this._basePort ? ':' + this._basePort : ''}/auth`; }

  protected _baseUrl: string = (isDevMode() ? 'http://localhost' : 'https://api.shingo.org/v2/affiliates');
  protected _basePort: string = (isDevMode() ? '8080' : '');

  private adminToken: string;

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
  public login(payload: { email: string, password: string }): Observable<any> {
    const options = this.http._defaultReqOpts;
    options.observe = 'response';
    return this.http.post<{ email: string, password: string }>(`${this.authHost}/login`, payload, options)
      .map(res => this.handleLogin(res))
      .catch(err => this.handleError(err));
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
      .map(data => this.handleLogout(data))
      .catch(err => this.handleError(err));
  }

  /**
    * Checks to see if user is authenticated. The user is authenticated if
    * the server returns a 200 response.
    * 
    * @returns {void} Returns void but causes `this.authenticationChange$` to emit a value.
    */
  public updateUserAuthStatus(): void {
    if (!this.http.jwt)
      return this.authenticationChange$.next(false);

    this.isValid();
  }

  public isValid(): Observable<boolean> {

    const options = this.http._defaultReqOpts;
    options.observe = 'response';

    const state = this._user ? this._user.state : UserState.Normal;
    return this.http.get<User>(`${this.authHost}/valid`, options)
      .map(res => {
        this.handleLogin(res, state);
        return true;
      }).catch(error => {
        // We don't care about HTTP 4XX errors, only HTTP 500 error
        if(error.status && error.status === 500) console.error('Caught error in auth.isValid(): ', error);
        this._user = null;
        this.authenticationChange$.next(false);
        return Observable.from([false]);
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
        this.handleLogin(res, this._user.state);
        return this._user;
      });
  }

  public changeUserPassword(password: string): Observable<any> {
    return this.http.post<User>(`${this.authHost}/changepassword`, { password })
      .map(res => {
        this.http.jwt = res.jwt;
        return res;
      });
  }

  public loginAs(facilitator: Facilitator): any {
    const options = this.http._defaultReqOpts;
    options.observe = 'response';
    if (!this._user.isAdmin) throw Error('Cannot loginAs if not Admin');   
    
    this.adminToken = this.http.jwt;
    
    return this.http.post(`${this.authHost}/loginas`, {
      adminId: this._user.authId,
      userId: facilitator._id
    }, options)
    .map(res => this.handleLogin(res, UserState.LoggedInAs))
    .catch(error => {
        this.adminToken = null;
        return this.handleError(error);
    });
  }

  private handleLogin(res: any, state: UserState = UserState.Normal): any {
    const data = res.body;
    this._user = new User(data);
    this._user.state = state;
    if (data.adminToken) {
      this._user.state = UserState.LoggedInAs;
      this.adminToken = data.adminToken;
    }
    this.http.jwt = data.jwt;
    this.authenticationChange$.next(res.status === 200);
    return data;
  }

  private handleLogout(data: any): UserState {
    const prevState = this._user.state || UserState.Normal;
    if (this._user.state === UserState.LoggedInAs) {
      this.user.state = UserState.Normal;
      this.http.jwt = this.adminToken;
      this.adminToken = null;
    } else {
      this._user = null;
      this.http.removeToken();
    }
    
    this.updateUserAuthStatus();
    return prevState;
  }

}
