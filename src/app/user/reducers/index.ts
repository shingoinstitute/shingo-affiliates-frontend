import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from '@ngrx/store'
import * as fromUser from './user.reducer'
import { getProperty } from '../../util/functional'
import { UserAction } from '../actions/user-api.actions'

export interface UserState {
  user: fromUser.State
}

// A slice of the global state. Keys here must not conflict with global state
export interface State {
  userdata: UserState
}

export const reducers: ActionReducerMap<UserState, UserAction> = {
  user: fromUser.reducer,
}

export const selectUserFeatureState = createFeatureSelector<State, UserState>(
  'userdata',
)
export const selectUserState = createSelector(
  selectUserFeatureState,
  getProperty('user'),
)

export const getUser = createSelector(selectUserState, getProperty('user'))

export const isAdmin = createSelector(
  getUser,
  user =>
    !!(user && (user.roles || []).some(r => r.name === 'Affiliate Manager')),
)
