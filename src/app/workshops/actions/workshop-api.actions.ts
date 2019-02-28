// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store'
import { CreateData, UpdateData } from '../services/workshop.service'
// tslint:disable-next-line: no-implicit-dependencies
import { SuccessResult } from 'jsforce'

export enum WorkshopApiActionTypes {
  WorkshopGetAll = '[Workshops/API] Get All',
  WorkshopGet = '[Workshops/API] Get',
  WorkshopUpdate = '[Workshops/API] Update',
  WorkshopDelete = '[Workshops/API] Delete',
  WorkshopCreate = '[Workshops/API] Create',
  WorkshopMutError = '[Workshops/API] Mut Error',
  WorkshopMutSuccess = '[Workshops/API] Mut Success',
}

export class WorkshopGetAll implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopGetAll
}

export class WorkshopGet implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopGet

  constructor(public payload: { id: string; selection?: boolean }) {}
}

export class WorkshopDelete implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopDelete

  constructor(public payload: { id: string }) {}
}

export class WorkshopCreate implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopCreate

  constructor(public payload: { workshop: CreateData }) {}
}

export class WorkshopUpdate implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopUpdate
  constructor(public payload: { id: string; data: UpdateData }) {}
}

export class WorkshopApiError implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopMutError
  constructor(
    public payload: {
      error: unknown
      action: Exclude<WorkshopApiAction, WorkshopApiError | WorkshopApiSuccess>
    },
  ) {}
}

export class WorkshopApiSuccess implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopMutSuccess
  constructor(
    public payload: {
      result: SuccessResult
      action: Exclude<WorkshopApiAction, WorkshopApiError | WorkshopApiSuccess>
    },
  ) {}
}

export type WorkshopApiAction =
  | WorkshopGet
  | WorkshopGetAll
  | WorkshopUpdate
  | WorkshopDelete
  | WorkshopCreate
  | WorkshopApiError
  | WorkshopApiSuccess
