import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { WorkshopService } from '../services/workshop.service'
import {
  WorkshopGetAll,
  WorkshopApiActionTypes,
  WorkshopGet,
  WorkshopUpdate,
} from '../actions/workshop-api.actions'
import { exhaustMap, map } from 'rxjs/operators'
import { WorkshopAdd } from '../actions/workshop.actions'
import { Omit, Overwrite } from '~app/util/types'

@Injectable()
export class WorkshopEffects {
  constructor(
    private actions$: Actions,
    private workshopService: WorkshopService,
  ) {}

  @Effect()
  getAll$ = this.actions$.pipe(
    ofType<WorkshopGetAll>(WorkshopApiActionTypes.WorkshopGetAll),
    exhaustMap(() =>
      this.workshopService
        .getAll()
        .pipe(map(workshops => new WorkshopAdd({ workshops }))),
    ),
  )

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType<WorkshopGet>(WorkshopApiActionTypes.WorkshopGet),
    exhaustMap(v =>
      this.workshopService
        .getById(v.payload.id)
        .pipe(map(w => new WorkshopAdd({ workshops: [w] }))),
    ),
  )

  @Effect()
  update$ = this.actions$.pipe(
    ofType<WorkshopUpdate>(WorkshopApiActionTypes.WorkshopUpdate),
    exhaustMap(v => {
      const workshop = { ...v.payload.workshop, Id: v.payload.id } as Overwrite<
        typeof v['payload']['workshop'],
        { Id: string }
      >
      return this.workshopService.update(workshop)
    }),
  )
}
