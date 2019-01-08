// tslint:disable: max-classes-per-file
import { Action } from '@ngrx/store'
import { WorkshopBase } from '../workshop.model'

export enum WorkshopActionTypes {
  WorkshopAdd = '[Workshops] Add',
  WorkshopRemove = '[Workshops] Remove',
}

export class WorkshopAdd implements Action {
  readonly type = WorkshopActionTypes.WorkshopAdd
  constructor(
    public payload: {
      /** the workshops to add to the store */
      workshops: WorkshopBase[]
    },
  ) {}
}

export class WorkshopRemove implements Action {
  readonly type = WorkshopActionTypes.WorkshopRemove
  constructor(public payload: { workshops: string[] }) {}
}

export type WorkshopAction = WorkshopAdd | WorkshopRemove
