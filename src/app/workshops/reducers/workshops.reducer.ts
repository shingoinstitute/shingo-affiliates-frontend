import produce from 'immer'
import {
  WorkshopActionTypes,
  WorkshopAction,
} from '../actions/workshop.actions'
import {
  WorkshopApiAction,
  WorkshopApiActionTypes,
} from '../actions/workshop-api.actions'
import { WorkshopBase, lastModifiedDate } from '../workshop.model'
import { AsyncResult, Mutable } from '~app/util/types'
import {
  left,
  right,
  isLeft,
  Right,
  isRight,
} from '~app/util/functional/Either'
import { unloadedAsync } from '~app/util/util'
import { greaterThan, ordDate } from 'fp-ts/lib/Ord'
import { mergeDeepRight } from 'ramda'

export interface WorkshopsValue {
  readonly [id: string]: Readonly<WorkshopBase>
}

export interface State {
  workshops: AsyncResult<WorkshopsValue>
  selectedWorkshop: AsyncResult<string>
}

export const initialState: State = {
  workshops: unloadedAsync,
  selectedWorkshop: unloadedAsync,
}

const gt = greaterThan(ordDate)

const mutAddWorkshops = (
  ws: WorkshopBase[],
  val: Mutable<WorkshopsValue> = {},
  replace?: boolean,
) => {
  for (const newWs of ws) {
    const old = val[newWs.Id]
    if (!old || replace) {
      val[newWs.Id] = newWs
      continue
    }

    const oldMod = lastModifiedDate(old)
    const newMod = lastModifiedDate(newWs)
    const greater = gt(newMod, oldMod)
    const equalAndMore =
      ordDate.equals(newMod, oldMod) &&
      Object.keys(newWs).length > Object.keys(old).length
    // only overwrite if the LastModifiedDate is newer, or dates are equal and the new data has more information
    if (greater || equalAndMore) {
      val[newWs.Id] = newWs
    }
  }
  return val
}

export function reducer(
  state = initialState,
  action: WorkshopAction | WorkshopApiAction,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case WorkshopApiActionTypes.WorkshopGetAll: {
        draft.workshops = left({ tag: 'loading' as 'loading' })
        return
      }
      case WorkshopApiActionTypes.WorkshopGet: {
        if (isLeft(state.workshops))
          draft.workshops = left({ tag: 'loading' as 'loading' })
        // we don't want to overwrite our existing data when it exists
        // there should be a better way to indicate state of a single item
        return
      }
      case WorkshopActionTypes.WorkshopAdded: {
        if (isRight(state.workshops)) {
          mutAddWorkshops(
            action.payload.workshops,
            draft.workshops.value as Mutable<WorkshopsValue>,
            action.payload.replace,
          )
          return
        } else {
          // we have some duplication here because we can't both return and modify the draft with immer
          draft.workshops = right(mutAddWorkshops(action.payload.workshops))
        }

        return
      }
      case WorkshopActionTypes.WorkshopRemoved: {
        if (isLeft(state.workshops)) return
        for (const id of action.payload.workshops) {
          delete (draft.workshops as Right<Mutable<WorkshopsValue>>).value[id]
        }
        return
      }
      case WorkshopActionTypes.WorkshopErrored: {
        draft.workshops = left({
          tag: 'failed' as 'failed',
          value: action.payload,
        })
        return
      }
      case WorkshopActionTypes.WorkshopSelect: {
        draft.selectedWorkshop = action.payload
        return
      }
      case WorkshopActionTypes.WorkshopSelectErrored: {
        draft.selectedWorkshop = left({
          tag: 'failed' as 'failed',
          value: action.payload,
        })
        return
      }
      case WorkshopActionTypes.WorkshopUpdate: {
        const { data, id } = action.payload
        if (isRight(state.workshops)) {
          const ws = draft.workshops.value as Mutable<WorkshopsValue>
          // if the id changed, we combine the old and new with the other if it exists
          // and delete the old id entry
          if (data.Id && id !== data.Id) {
            ws[data.Id] = (mergeDeepRight(
              ws[data.Id] || {},
              mergeDeepRight(ws[id], data),
            ) as unknown) as WorkshopBase
            delete ws[id]
            return
          }

          // TODO: remove type assertion when typings fixed
          ws[id] = (mergeDeepRight(ws[id], data) as unknown) as WorkshopBase
          return
        }
        // don't do anything if we are in a left state
        // we don't have the old workshop to use as a patch
      }
    }
  })
}
