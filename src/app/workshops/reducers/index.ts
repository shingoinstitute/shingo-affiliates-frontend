import * as fromWorkshops from './workshops.reducer'
// tslint:disable-next-line: no-duplicate-imports
import { State as WorkshopState } from './workshops.reducer'
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store'
import { WorkshopAction } from '../actions/workshop.actions'
import { property, snd, K, pipe } from '~app/util/functional'
import { recordEntries } from '~app/util/util'
import { map, filter } from '~app/util/iterable'

export { WorkshopState }

export const ROOT_KEY = 'workshops' as 'workshops'

// A slice of the global state - keys must not conflict
export interface State {
  [ROOT_KEY]: WorkshopState
}

export const reducers: ActionReducerMap<State, WorkshopAction> = {
  workshops: fromWorkshops.reducer,
}

export const selectWorkshopState = createFeatureSelector<State, WorkshopState>(
  'workshops',
)
export const getWorkshopMap = createSelector(
  selectWorkshopState,
  property('workshops'),
)

type GetWorkshopMapReturn = ReturnType<typeof getWorkshopMap>

export const getWorkshops = (
  pred: (w: GetWorkshopMapReturn[keyof GetWorkshopMapReturn]) => boolean = K(
    true,
  ),
) =>
  createSelector(getWorkshopMap, wsMap =>
    Array.from(filter(map(recordEntries(wsMap), snd), pred)),
  )
