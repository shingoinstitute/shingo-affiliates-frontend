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

export interface WorkshopsValue {
  readonly [id: string]: Readonly<WorkshopBase>
}

export type StateUnion = AsyncResult<WorkshopsValue>
export type State = StateUnion

export const initialState: State = left({ tag: 'unloaded' as 'unloaded' })

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
        return left({ tag: 'loading' as 'loading' })
      }
      case WorkshopApiActionTypes.WorkshopGet: {
        if (isLeft(state)) return left({ tag: 'loading' as 'loading' })
        // we don't want to overwrite our existing data when it exists
        // there should be a better way to indicate state of a single item
        return
      }
      case WorkshopActionTypes.WorkshopAdded: {
        if (isRight(state)) {
          mutAddWorkshops(action.payload.workshops, draft.value as Mutable<
            WorkshopsValue
          >)
          return
        }

        // we have some duplication here because we can't both return and modify the draft with immer
        return right(mutAddWorkshops(action.payload.workshops))
      }
      case WorkshopActionTypes.WorkshopRemoved: {
        if (isLeft(draft as State)) return
        for (const id of action.payload.workshops) {
          delete (draft as Right<Mutable<WorkshopsValue>>).value[id]
        }
        return
      }
      case WorkshopActionTypes.WorkshopErrored: {
        return left({ tag: 'failed' as 'failed', value: action.payload })
      }
    }
  })
}
