// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store'

export enum AuthApiActionTypes {
  LoginSuccess = '[Auth/API] Login Success',
  LoginFailure = '[Auth/API] Login Failure',
  LoginRedirect = '[Auth/API] Login Redirect',
}

export class LoginSuccess implements Action {
  readonly type = AuthApiActionTypes.LoginSuccess
}

export class LoginFailure implements Action {
  readonly type = AuthApiActionTypes.LoginFailure

  constructor(public payload: { error: any }) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthApiActionTypes.LoginRedirect
}

export type AuthApiAction = LoginSuccess | LoginFailure | LoginRedirect
