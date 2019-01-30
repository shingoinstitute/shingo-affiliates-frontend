// tslint:disable-next-line: no-duplicate-imports
import { State as WorkshopState } from './workshops.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { snd, K, pipe, property } from '~app/util/functional'
import { recordEntries } from '~app/util/util'
import { mapC as mapI, filterC as filterI } from '~app/util/iterable'
import {
  mapC,
  map as mapEither,
  chain as chainEither,
} from '~app/util/functional/Either'
import { WorkshopBase } from '../workshop.model'
import { AsyncResult } from '~app/util/types'

export { WorkshopState }

export const ROOT_KEY = 'workshops'

// A slice of the global state - keys must not conflict
export interface State {
  [ROOT_KEY]: WorkshopState
}

// export const reducers: ActionReducerMap<State, WorkshopAction> = {
//   [ROOT_KEY]: fromWorkshops.reducer,
// }

export const selectWorkshopState = createFeatureSelector<State, WorkshopState>(
  ROOT_KEY,
)

export const selectWorkshops = createSelector(
  selectWorkshopState,
  property('workshops'),
)
export const selectSelectedWorkshopId = createSelector(
  selectWorkshopState,
  property('selectedWorkshop'),
)

export type GetWorkshopsResult = AsyncResult<WorkshopBase[]>

/**
 * Selector for an array of workshops wrapped in the AsyncResult
 *
 * Use only if the predicate and its parameters are static (because of memoization)
 * @param pred a predicate to filter workshops
 */
export const getWorkshops = (pred: (w: WorkshopBase) => boolean = K(true)) =>
  createSelector(
    selectWorkshops,
    mapC(
      pipe(
        recordEntries,
        mapI(snd),
        filterI(pred),
        v => Array.from(v),
      ),
    ),
  )

/**
 * Selector that uses the selected workshop's id from the store to return a workshop
 */
export const getCurrentWorkshop = createSelector(
  selectWorkshops,
  selectSelectedWorkshopId,
  (wsE, idE) =>
    chainEither(wsE, ws =>
      mapEither(idE, id => ws[id] as WorkshopBase | undefined),
    ),
)
