import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { ApiContract } from '../../util/api-contract'
import { AuthController } from '@shingo/affiliates-api/controllers'
import { HttpClient } from '@angular/common/http'
import { JwtHelperService } from '@auth0/angular-jwt'
import { tap } from 'rxjs/operators'
import { ApiBase } from '../../shared/services/api/api-base.abstract'

export const TOKEN_KEY = 'jwt_token'
export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY)
}

export type AuthContract = ApiContract<AuthController>
export type AuthPayload = AuthContract['login']['body']

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiBase {
  constructor(http: HttpClient, private jwt: JwtHelperService) {
    super(http)
  }

  public get authenticated() {
    return !!(tokenGetter() && !this.jwt.isTokenExpired())
  }

  login(payload: AuthPayload): Observable<AuthContract['login']['returntype']> {
    // tslint:disable-next-line:prettier
    type Base = AuthContract['login']
    return this.request<Base>('/auth/login', 'POST', { body: payload }).pipe(
      tap(({ jwt }) => localStorage.setItem(TOKEN_KEY, jwt)),
    )
  }

  public valid() {
    type Base = AuthContract['valid']
    return this.request<Base>('/auth/valid', 'GET')
  }

  public logout() {
    localStorage.removeItem(TOKEN_KEY)
    return of(true)
  }

  public loginAs(facilitator: AuthContract['loginAs']['body']) {
    type Base = AuthContract['loginAs']
    return this.request<Base>('/auth/loginas', 'POST', { body: facilitator })
  }

  public changePassword(payload: AuthContract['changePassword']['body']) {
    type Base = AuthContract['changePassword']
    return this.request<Base>('/auth/changepassword', 'POST', { body: payload })
  }
}
