import { AuthApiActions, LoginPageActions } from '../actions'
import produce from 'immer'

export interface State {
  error: unknown | null
  pending: boolean
}

export const initialState: State = {
  error: null,
  pending: false,
}

export function reducer(
  state = initialState,
  action: AuthApiActions.AuthApiAction | LoginPageActions.LoginPageAction,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case LoginPageActions.LoginPageActionTypes.Login: {
        draft.error = null
        draft.pending = true
        return
      }

      case AuthApiActions.AuthApiActionTypes.LoginSuccess: {
        draft.error = null
        draft.pending = false
        return
      }

      case AuthApiActions.AuthApiActionTypes.LoginFailure: {
        draft.error = action.payload.error
        draft.pending = false
        return
      }
    }
  })
}
