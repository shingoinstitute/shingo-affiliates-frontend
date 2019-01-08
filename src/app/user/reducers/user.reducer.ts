import { User } from '../services/user.service'
import produce from 'immer'
import { UserAction, UserActionTypes } from '../actions/user-api.actions'

export interface State {
  readonly user: Readonly<User> | null
}

export const initialState: State = {
  user: null,
}

export function reducer(state = initialState, action: UserAction): State {
  return produce(state, draft => {
    switch (action.type) {
      case UserActionTypes.UserRenewSuccess: {
        draft.user = action.payload.user
        return
      }
    }
  })
}
