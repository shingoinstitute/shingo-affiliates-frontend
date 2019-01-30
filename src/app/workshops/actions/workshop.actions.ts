// tslint:disable: max-classes-per-file
import { Action } from '@ngrx/store'
import { WorkshopBase } from '../workshop.model'
import { AsyncResult } from '~app/util/types'

export enum WorkshopActionTypes {
  WorkshopAdded = '[Workshops] Added',
  WorkshopRemoved = '[Workshops] Removed',
  WorkshopErrored = '[Workshops] Errored',
  WorkshopSelect = '[Workshops] Select',
  WorkshopSelectErrored = '[Workshops] Select Errored',
}

export class WorkshopAdded implements Action {
  readonly type = WorkshopActionTypes.WorkshopAdded
  constructor(
    public payload: {
      /** the workshops to add to the store */
      workshops: WorkshopBase[]
    },
  ) {}
}

export class WorkshopRemoved implements Action {
  readonly type = WorkshopActionTypes.WorkshopRemoved
  constructor(public payload: { workshops: string[] }) {}
}

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

export type WorkshopAction =
  | WorkshopAdded
  | WorkshopRemoved
  | WorkshopErrored
  | WorkshopSelect
  | WorkshopSelectErrored
