import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from '@ngrx/store'
import * as fromUser from './user.reducer'
import { property } from '../../util/functional'
import { UserAction } from '../actions/user-api.actions'

export interface UserState {
  user: fromUser.State
}

export const ROOT_KEY = 'userdata' as 'userdata'

// A slice of the global state. Keys here must not conflict with global state
export interface State {
  [ROOT_KEY]: UserState
}

export const reducers: ActionReducerMap<UserState, UserAction> = {
  user: fromUser.reducer,
}

export const selectUserFeatureState = createFeatureSelector<State, UserState>(
  'userdata',
)
export const selectUserState = createSelector(
  selectUserFeatureState,
  property('user'),
)

export const getUser = createSelector(selectUserState, property('user'))

export const isAdmin = createSelector(
  getUser,
  user =>
    !!(user && (user.roles || []).some(r => r.name === 'Affiliate Manager')),
)
