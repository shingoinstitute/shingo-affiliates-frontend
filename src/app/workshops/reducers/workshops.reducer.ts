import produce from 'immer'
import {
  WorkshopActionTypes,
  WorkshopAction,
} from '../actions/workshop.actions'
import {
  WorkshopApiAction,
  WorkshopApiActionTypes,
} from '../actions/workshop-api.actions'
import { WorkshopBase } from '../workshop.model'
import { AsyncResult, Mutable } from '~app/util/types'
import {
  left,
  right,
  isLeft,
  Right,
  isRight,
} from '~app/util/functional/Either'
import { unloadedAsync } from '~app/util/util'

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

const mutAddWorkshops = (
  ws: WorkshopBase[],
  val: Mutable<WorkshopsValue> = {},
) => {
  for (const newWs of ws) {
    val[newWs.Id] = newWs
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
          mutAddWorkshops(action.payload.workshops, draft.workshops
            .value as Mutable<WorkshopsValue>)
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
    }
  })
}
