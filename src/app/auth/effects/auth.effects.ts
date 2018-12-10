import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, exhaustMap, map, tap, mergeMap } from 'rxjs/operators'
import { LoginPageActions, AuthActions, AuthApiActions } from '../actions'
import { AuthService } from '../services/auth.service'
import { UserRenew } from '../../user/actions/user-api.actions'

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType<LoginPageActions.Login>(LoginPageActions.LoginPageActionTypes.Login),
    map(action => action.payload),
    exhaustMap(auth =>
      this.authService.login(auth).pipe(
        map(() => new AuthApiActions.LoginSuccess()),
        catchError(error => of(new AuthApiActions.LoginFailure({ error }))),
      ),
    ),
  )

  // TODO: redirect to users last page, not /
  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthApiActions.AuthApiActionTypes.LoginSuccess),
    tap(() => this.router.navigate(['/'])),
    map(() => new UserRenew()),
  )

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(
      AuthApiActions.AuthApiActionTypes.LoginRedirect,
      AuthActions.AuthActionTypes.Logout,
    ),
    tap(() => {
      this.router.navigate(['/login'])
    }),
  )

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.Logout),
    mergeMap(() => this.authService.logout()),
    tap(() => {
      this.router.navigate(['/login'])
    }),
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}
