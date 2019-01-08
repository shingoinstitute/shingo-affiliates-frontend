// tslint:disable:max-classes-per-file
import { Action } from '@ngrx/store'
import { WorkshopBase } from '../workshop.model'
import { RequireKeys } from '~app/util/types'

export enum WorkshopApiActionTypes {
  WorkshopGetAll = '[Workshops/API] Get All',
  WorkshopGet = '[Workshops/API] Get',
  WorkshopUpdate = '[Workshops/API] Update',
  WorkshopDelete = '[Workshops/API] Delete',
  WorkshopCreate = '[Workshops/API] Create',
}

export class WorkshopGetAll implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopGetAll
}

export class WorkshopGet implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopGet

  constructor(public payload: { id: string }) {}
}

export class WorkshopUpdate implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopUpdate

  constructor(
    public payload: {
      id: string
      workshop: RequireKeys<Partial<WorkshopBase>, 'Organizing_Affiliate__c'>
    },
  ) {}
}

export class WorkshopDelete implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopDelete

  constructor(public payload: { id: string }) {}
}

export class WorkshopCreate implements Action {
  readonly type = WorkshopApiActionTypes.WorkshopCreate

  constructor(public payload: { workshop: Partial<WorkshopBase> }) {}
}

export type WorkshopApiAction =
  | WorkshopGet
  | WorkshopGetAll
  | WorkshopUpdate
  | WorkshopDelete
  | WorkshopCreate
