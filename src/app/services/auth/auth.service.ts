// Angular Modules
import { Injectable } from '@angular/core'

// App Modules
import { environment } from '../../../environments/environment'

// RxJS Modules
import { HttpClient } from '@angular/common/http'
import { JwtHelperService } from '@auth0/angular-jwt'

export const TOKEN_KEY = 'jwt_token'
export const tokenGetter = () => localStorage.getItem(TOKEN_KEY)
import { AuthController } from '@shingo/affiliates-api/controllers/auth/auth.controller'
import { ApiContract } from '../../util/types'

type AuthContract = ApiContract<AuthController>

@Injectable()
export class AuthService {
  public get authHost(): string {
    return `https://${environment.authApiDomain}${environment.authApiRoute}`
  }

  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  /**
   * Logs in the user after succesful authentication with email and password
   *
   * @param payload The authentication credentials
   */
  public login(payload: AuthContract['login']['body']) {
    const route: AuthContract['login']['metadata']['route'] = '/auth/login'
    return this.http
      .post<AuthContract['login']['returntype']>(
        `${this.authHost}${route}`,
        payload,
      )
      .toPromise()
      .then(res => {
        localStorage.setItem(TOKEN_KEY, res.jwt)
      })
  }

  public valid() {
    const route: AuthContract['valid']['metadata']['route'] = '/auth/valid'
    return this.http.get<AuthContract['valid']['returntype']>(
      `${this.authHost}${route}`,
    )
  }

  /**
   * Logs the user out and removes their JWT token.
   *
   */
  public logout() {
    localStorage.removeItem(TOKEN_KEY)
  }

  public isValid() {
    return !this.jwt.isTokenExpired()
  }
}
