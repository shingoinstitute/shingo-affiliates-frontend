import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import { storeFreeze } from 'ngrx-store-freeze'
import * as fromRouter from '@ngrx/router-store'
import * as fromAuth from '../auth/reducers'
import * as fromUser from '../user/reducers'

export interface RootState {
  router: fromRouter.RouterReducerState
}

export type State = RootState & fromAuth.State & fromUser.State

export const rootReducers: ActionReducerMap<RootState> = {
  router: fromRouter.routerReducer,
}

export const reducers: ActionReducerMap<State> = rootReducers as any

export function storeLogger(
  reducer: ActionReducer<State>,
): ActionReducer<State> {
  return (state, action) => {
    console.log('state', state)
    console.log('action', action)

    return reducer(state, action)
  }
}

export const metaReducers: Array<MetaReducer<State>> = !environment.production
  ? [storeLogger, storeFreeze]
  : []
