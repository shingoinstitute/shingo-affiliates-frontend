import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import { map, take, mergeMap } from 'rxjs/operators'
import { AuthApiActions } from '../actions'
import * as fromAuth from '../reducers'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private store: Store<fromAuth.State>,
  ) {}

  canActivate(): Observable<boolean> {
    return this.checkStoreAuthentication().pipe(
      mergeMap(storeAuth => {
        if (storeAuth) {
          return of(true)
        }

        return this.checkApiAuthentication()
      }),
      map(storeOrApiAuth => {
        if (!storeOrApiAuth) {
          this.store.dispatch(new AuthApiActions.LoginRedirect())
          return false
        }

        return true
      }),
    )
  }

  private checkStoreAuthentication() {
    return this.store.pipe(
      select(fromAuth.getLoggedIn),
      take(1),
    )
  }

  private checkApiAuthentication() {
    return of(this.auth.authenticated)
  }
}
