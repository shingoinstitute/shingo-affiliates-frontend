import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { environment } from '../../environments/environment'
import { storeFreeze } from 'ngrx-store-freeze'
import * as fromRouter from '@ngrx/router-store'
import { State as AuthState } from '../auth/reducers'
import { State as UserState } from '../user/reducers'
import { State as WorkshopState } from '../workshops/reducers'

export interface RootState {
  router: fromRouter.RouterReducerState
}

export type State = RootState & AuthState & UserState & WorkshopState

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
