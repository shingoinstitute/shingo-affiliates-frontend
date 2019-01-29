// tslint:disable-next-line: no-duplicate-imports
import { State as WorkshopState } from './workshops.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { snd, K, pipe, Predicate, Refinement } from '~app/util/functional'
import { recordEntries } from '~app/util/util'
import { mapC as mapI, filterC as filterI } from '~app/util/iterable'
import { mapC, map as mapEither } from '~app/util/functional/Either'
import { WorkshopBase } from '../workshop.model'
import { AsyncResult } from '~app/util/types'
import { selectRouteParams } from '~app/reducers'

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

export type GetWorkshopsResult = AsyncResult<WorkshopBase[]>

/**
 * Selector for an array of workshops wrapped in the AsyncResult
 *
 * Use only if the predicate and its parameters are static (because of memoization)
 * @param pred a predicate to filter workshops
 */
export const getWorkshops = (pred: (w: WorkshopBase) => boolean = K(true)) =>
  createSelector(
    selectWorkshopState,
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
 * Selector that uses the id in the router store to return a workshop
 */
export const getCurrentWorkshop = createSelector(
  selectWorkshopState,
  selectRouteParams,
  (wsE, params) =>
    mapEither(
      wsE,
      ws => (params ? ws[params.id] : undefined) as WorkshopBase | undefined,
    ),
)
