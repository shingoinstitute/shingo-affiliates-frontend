import { Action } from '@ngrx/store'
import { AuthPayload } from '../services/auth.service'

export enum LoginPageActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = LoginPageActionTypes.Login

  constructor(public payload: AuthPayload) {}
}

export type LoginPageAction = Login
