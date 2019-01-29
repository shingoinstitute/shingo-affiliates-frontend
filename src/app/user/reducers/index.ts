import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State as UserState } from './user.reducer'
import { matchC, mapC } from '~app/util/functional/Either'
import { id } from '~app/util/functional'

// export interface UserState {
//   user: fromUser.State
// }
export { UserState }

export const ROOT_KEY = 'userdata'

// A slice of the global state. Keys here must not conflict with global state
export interface State {
  [ROOT_KEY]: UserState
}

// using ActionReducerMap makes our root state look like { [ROOT_KEY]: { [k in keyof ReducerMap]: State } }
// therefore if we only want to have a single state under our root key, we should not use action reducer map,
// and instead just export the reducer, giving us a root state like { [ROOT_KEY]: State }
// export const reducers: ActionReducerMap<UserState, UserAction> = {
//   user: fromUser.reducer,
// }

export const selectUserFeatureState = createFeatureSelector<State, UserState>(
  ROOT_KEY,
)

export const getUserResult = selectUserFeatureState
export const getUser = createSelector(
  selectUserFeatureState,
  matchC(() => null, id),
)

export const isAdminResult = createSelector(
  selectUserFeatureState,
  mapC(user => (user.roles || []).some(r => r.name === 'Affiliate Manager')),
)

export const isAdmin = createSelector(
  isAdminResult,
  matchC(() => false, id),
)
