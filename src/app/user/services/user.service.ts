import { ApiContract } from '../../util/api-contract'
import {
  AuthController,
  FacilitatorsController,
} from '@shingo/affiliates-api/controllers'
import { Injectable } from '@angular/core'
import { ApiBase } from '../../shared/services/api/api-base.abstract'
import { Observable, throwError, of } from 'rxjs'
import * as fromUser from '../reducers'
import { Store, select } from '@ngrx/store'
import { HttpClient } from '@angular/common/http'
import { mergeMap } from 'rxjs/operators'
import { AuthService } from '../../auth/services/auth.service'
import { User } from '../user.model'

export type AuthContract = ApiContract<AuthController>
export type FacilitatorContract = ApiContract<FacilitatorsController>
export type AuthPayload = AuthContract['login']['body']
export { User }

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiBase {
  private user$: Observable<User | null>

  constructor(
    http: HttpClient,
    private store: Store<fromUser.State>,
    private auth: AuthService,
  ) {
    super(http)
    this.user$ = this.store.pipe(select(fromUser.getUser))
  }

  getUser() {
    type Base = AuthContract['valid']
    return this.request<Base>('/auth/valid', 'GET')
  }

  changePassword(payload: { oldPassword: string; password: string }) {
    type Base = AuthContract['changePassword']

    return this.user$.pipe(
      mergeMap(
        user =>
          user && user.email
            ? this.auth
                .login({ email: user.email, password: payload.oldPassword })
                .pipe(
                  mergeMap(() =>
                    this.request<Base>('/auth/changepassword', 'POST', {
                      body: payload,
                    }),
                  ),
                )
            : throwError(new Error('Must be logged in to change password')),
      ),
    )
  }

  resetPassword(payload: { token: string; password: string }) {
    type Base = FacilitatorContract['changePassword']
    const route /*: Base['metadata']['route']*/ = '/resetpassword/token'
    const method /*: Base['metdata']['method']*/ = 'POST'

    return throwError(new Error('Unimplemented'))
    // return this.request<any>(route, method, { body: payload }) as Observable<
    //   Base['returntype']
    // >
  }
}
