import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import {
  UserRenew,
  UserActionTypes,
  UserRenewSuccess,
} from '../actions/user-api.actions'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { UserService } from '../services/user.service'
import { TOKEN_KEY } from '../../auth/services/auth.service'
import { AuthApiActions } from '../../auth/actions'
import { of, throwError } from 'rxjs'

@Injectable()
export class UserEffects {
  @Effect()
  userRenew$ = this.actions$.pipe(
    ofType<UserRenew>(UserActionTypes.UserRenew),
    exhaustMap(() =>
      this.userService.getUser().pipe(
        map(user => new UserRenewSuccess({ user })),
        catchError(error => {
          if (error.status === 403) {
            localStorage.removeItem(TOKEN_KEY)
            return of(new AuthApiActions.LoginRedirect())
          }
          return throwError(error)
        }),
      ),
    ),
  )

  constructor(private actions$: Actions, private userService: UserService) {}
}
