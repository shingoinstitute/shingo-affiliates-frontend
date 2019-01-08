import { AuthApiActions, AuthActions } from '../actions'
import produce from 'immer'
import {
  UserRenewSuccess,
  UserActionTypes,
} from '../../user/actions/user-api.actions'

export interface State {
  readonly isLoggedIn: boolean
}

export const initialState: State = {
  isLoggedIn: false,
}

export function reducer(
  state = initialState,
  action:
    | UserRenewSuccess
    | AuthApiActions.AuthApiAction
    | AuthActions.AuthAction,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case UserActionTypes.UserRenewSuccess:
      case AuthApiActions.AuthApiActionTypes.LoginSuccess: {
        draft.isLoggedIn = true
        return
      }

      case AuthActions.AuthActionTypes.Logout: {
        return initialState
      }
    }
  })
}
