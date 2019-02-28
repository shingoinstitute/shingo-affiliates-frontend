// tslint:disable: max-classes-per-file
import { Action } from '@ngrx/store'
import { WorkshopBase } from '../workshop.model'
import { AsyncResult } from '~app/util/types'
import { UpdateData } from '../services/workshop.service'

export enum WorkshopActionTypes {
  WorkshopAdded = '[Workshops] Added',
  WorkshopRemoved = '[Workshops] Removed',
  WorkshopErrored = '[Workshops] Errored',
  WorkshopSelect = '[Workshops] Select',
  WorkshopSelectErrored = '[Workshops] Select Errored',
  WorkshopUpdate = '[Workshops] Update',
}

export class WorkshopAdded implements Action {
  readonly type = WorkshopActionTypes.WorkshopAdded
  constructor(
    public payload: {
      /** the workshops to add to the store */
      workshops: WorkshopBase[]
      replace?: boolean
    },
  ) {}
}

export class WorkshopRemoved implements Action {
  readonly type = WorkshopActionTypes.WorkshopRemoved
  constructor(public payload: { workshops: string[] }) {}
}

/**
 * Used for errors when querying apis, or errors that are entirely client-side
 * Use WorkshopApiError for errors caused by server mutation (POST/Create, PUT/Update)
 */
export class WorkshopErrored implements Action {
  readonly type = WorkshopActionTypes.WorkshopErrored
  constructor(public payload: unknown) {}
}

export class WorkshopSelect implements Action {
  readonly type = WorkshopActionTypes.WorkshopSelect
  /**
   * A selection is not inherently asynchronous, but we can use it
   * to keep track of the async status of getting a specific workshop,
   * since most of the time when we request a workshop from the network
   * we immediately select it in the store
   */
  constructor(public payload: AsyncResult<string>) {}
}
export class WorkshopSelectErrored implements Action {
  readonly type = WorkshopActionTypes.WorkshopSelectErrored
  constructor(public payload: unknown) {}
}

export class WorkshopUpdate implements Action {
  readonly type = WorkshopActionTypes.WorkshopUpdate
  constructor(public payload: { id: string; data: Partial<WorkshopBase> }) {}
}

export type WorkshopAction =
  | WorkshopAdded
  | WorkshopRemoved
  | WorkshopErrored
  | WorkshopSelect
  | WorkshopSelectErrored
  | WorkshopUpdate
