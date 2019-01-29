// tslint:disable: max-classes-per-file
import { Action } from '@ngrx/store'
import { WorkshopBase } from '../workshop.model'

export enum WorkshopActionTypes {
  WorkshopAdded = '[Workshops] Added',
  WorkshopRemoved = '[Workshops] Removed',
  WorkshopErrored = '[Workshops] Errored',
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

export type WorkshopAction = WorkshopAdded | WorkshopRemoved | WorkshopErrored
