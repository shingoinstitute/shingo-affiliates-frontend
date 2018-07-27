// Angular Modules
import { Facilitator } from '../../facilitators/facilitator.model';
import { Injectable, EventEmitter } from '@angular/core';

// App Modules
import { BaseService } from '../api/base.abstract.service';
import { User, UserState } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

// RxJS Modules
import { Observable,  BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { requestOptions } from '../../util/util';
import { tuple } from '../../util/functional';

// RxJS operators

@Injectable()
export class JWTService {
  public get jwt(): string | null { return this.cs.get('x-jwt') || null; }
  public set jwt(token: string) { this.cs.put('x-jwt', token); }
  public removeToken() { this.cs.remove('x-jwt'); }
  constructor(private cs: CookieService) { }
}

@Injectable()
export class AuthService extends BaseService {

  public authenticationChange$: BehaviorSubject<boolean>;
  public get user() { return this._user; }
  public _user: User;

  public get authHost(): string { return `${this._baseUrl}/auth`; }

  protected _baseUrl = environment.authApiUrl;

  private adminToken: string;

  constructor(public http: HttpClient, private jwtService: JWTService) {
    super();
    this.authenticationChange$ = new BehaviorSubject<boolean>(!!jwtService.jwt);
  }

  /**
    * Logs in the user after succesful authentication with email and password
    *
    * @param payload The authentication credentials
    */
  public login(payload: { email: string, password: string }): Observable<any> {
    const options = { ...requestOptions(this.jwtService), observe: 'response' as 'response' };
    return this.http.post<{ email: string, password: string }>(`${this.authHost}/login`, payload, options)
      .map(res => this.handleLogin(res))
      .catch(err => this.handleError(err));
  }

  /**
    * Logs the user out and removes their JWT token.
    *
    */
  public logout(): Observable<any> {
    const options = { ...requestOptions(this.jwtService), observe: 'response' as 'response' };

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
    if (!this.jwtService.jwt) return this.authenticationChange$.next(false);

    this.isValid();
  }

  public isValid(): Observable<boolean> {
    const options = { ...requestOptions(this.jwtService), observe: 'response' as 'response' };

    const state = this._user ? this._user.state : UserState.Normal;
    return this.http.get<User>(`${this.authHost}/valid`, options)
      .map(res => {
        this.handleLogin(res, state);
        return true;
      }).catch(error => {
        // We don't care about HTTP 4XX errors, only HTTP 500 error
        if (error.status && error.status === 500) console.error('Caught error in auth.isValid(): ', error);
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
    const options = {
      ...requestOptions(this.jwtService, tuple('x-force-refresh', 'true')),
      observe: 'response' as 'response'
    };

    return this.http.get<User>(`${this.authHost}/valid`, options)
      .map(res => {
        this.handleLogin(res, this._user.state);
        return this._user;
      });
  }

  public changeUserPassword(password: string) {
    return this.http.post<{ jwt: string }>(`${this.authHost}/changepassword`, { password }, requestOptions(this.jwtService))
      .map(res => {
        this.jwtService.jwt = res.jwt;
        return res;
      });
  }

  public loginAs(facilitator: Facilitator): any {
    const options = { ...requestOptions(this.jwtService), observe: 'response' as 'response' };
    if (!this._user.isAdmin) throw Error('Cannot loginAs if not Admin');

    this.adminToken = this.jwtService.jwt;

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
    this.jwtService.jwt = data.jwt;
    this.authenticationChange$.next(res.status === 200);
    return data;
  }

  private handleLogout(data: any): UserState {
    const prevState = this._user.state || UserState.Normal;
    if (this._user.state === UserState.LoggedInAs) {
      this.user.state = UserState.Normal;
      this.jwtService.jwt = this.adminToken;
      this.adminToken = null;
    } else {
      this._user = null;
      this.jwtService.removeToken();
    }

    this.updateUserAuthStatus();
    return prevState;
  }

}
