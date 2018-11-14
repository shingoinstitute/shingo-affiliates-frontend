import { Action } from '@ngrx/store'
import { User } from '../services/user.service'

// tslint:disable:max-classes-per-file
export enum UserActionTypes {
  UserRenew = '[User API] User Renew',
  UserRenewSuccess = '[User API] User Renew Success',
}

export class UserRenew implements Action {
  readonly type = UserActionTypes.UserRenew
}

export class UserRenewSuccess implements Action {
  readonly type = UserActionTypes.UserRenewSuccess

  constructor(public payload: { user: User }) {}
}

export type UserAction = UserRenew | UserRenewSuccess
