import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import {
  UserRenew,
  UserActionTypes,
  UserRenewSuccess,
} from '../actions/user-api.actions'
import { exhaustMap, map } from 'rxjs/operators'
import { UserService } from '../services/user.service'

@Injectable()
export class UserEffects {
  @Effect()
  userRenew$ = this.actions$.pipe(
    ofType<UserRenew>(UserActionTypes.UserRenew),
    exhaustMap(() =>
      this.userService
        .getUser()
        .pipe(map(user => new UserRenewSuccess({ user }))),
    ),
  )

  constructor(private actions$: Actions, private userService: UserService) {}
}
