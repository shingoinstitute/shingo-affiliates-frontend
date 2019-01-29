import { User } from '../services/user.service'
import { UserAction, UserActionTypes } from '../actions/user-api.actions'
import { AsyncResult } from '~app/util/types'
import { left, right } from '~app/util/functional/Either'

export type StateUnion = AsyncResult<Readonly<User>>

export type State = StateUnion

export const initialState: State = left({ tag: 'unloaded' as 'unloaded' })

export function reducer(state = initialState, action: UserAction): State {
  switch (action.type) {
    case UserActionTypes.UserRenew: {
      return left({ tag: 'loading' as 'loading' })
    }
    case UserActionTypes.UserRenewSuccess: {
      return right(action.payload.user)
    }
    case UserActionTypes.UserRenewError: {
      return left({ tag: 'failed' as 'failed', value: action.payload })
    }
    default:
      return state
  }
}
