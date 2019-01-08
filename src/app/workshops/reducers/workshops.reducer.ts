import produce from 'immer'
import {
  WorkshopActionTypes,
  WorkshopAction,
} from '../actions/workshop.actions'
import { WorkshopApiAction } from '../actions/workshop-api.actions'
import { WorkshopBase } from '../workshop.model'

export interface State {
  readonly workshops: { readonly [id: string]: Readonly<WorkshopBase> }
}

export const initialState: State = {
  workshops: {},
}

export function reducer(
  state = initialState,
  action: WorkshopAction | WorkshopApiAction,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case WorkshopActionTypes.WorkshopAdd: {
        for (const newWs of action.payload.workshops) {
          draft.workshops[newWs.Id] = newWs
        }
        return draft
      }
      case WorkshopActionTypes.WorkshopRemove: {
        for (const id of action.payload.workshops) {
          delete draft.workshops[id]
        }
        return draft
      }

      default:
        return state
    }
  })
}
