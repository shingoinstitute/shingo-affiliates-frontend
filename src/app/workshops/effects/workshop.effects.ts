import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { WorkshopService } from '../services/workshop.service'
import {
  WorkshopGetAll,
  WorkshopApiActionTypes,
  WorkshopGet,
  WorkshopUpdate,
} from '../actions/workshop-api.actions'
import { exhaustMap, map, catchError, filter, switchMap } from 'rxjs/operators'
import { WorkshopAdded, WorkshopErrored } from '../actions/workshop.actions'
import { Overwrite } from '~app/util/types'
import { of } from 'rxjs'
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store'
import { Route, ActivatedRouteSnapshot } from '@angular/router'
import { array } from 'fp-ts/lib/Array'
import { fromFoldable, Optional, Lens } from 'monocle-ts'
import { editRoute, detailRoute } from '../workshops-routing.module'
import { isSome } from 'fp-ts/lib/Option'
import { or } from 'fp-ts/lib/function'

const fromRouteConfig = (config: Route) => (r: ActivatedRouteSnapshot) =>
  !!(r.routeConfig && r.routeConfig.path === config.path)
const navAction = Lens.fromProp<
  RouterNavigationAction<SerializedRouterStateSnapshot>
>()

const handleError = catchError(err => of(new WorkshopErrored(err)))

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
      this.workshopService.getAll().pipe(
        map(workshops => new WorkshopAdded({ workshops })),
        handleError,
      ),
    ),
  )

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType<WorkshopGet>(WorkshopApiActionTypes.WorkshopGet),
    exhaustMap(v =>
      this.workshopService.getById(v.payload.id).pipe(
        map(w => new WorkshopAdded({ workshops: [w] })),
        handleError,
      ),
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

  @Effect()
  navigateDetail$ = this.actions$.pipe(
    ofType<RouterNavigationAction>(ROUTER_NAVIGATION),
    map(
      navAction('payload')
        .compose(Lens.fromProp('routerState'))
        .compose(Lens.fromProp('root'))
        .composeOptional(Optional.fromNullableProp('children'))
        .composeFold(fromFoldable(array)())
        .find(or(fromRouteConfig(editRoute), fromRouteConfig(detailRoute))),
    ),
    filter(isSome),
    switchMap(({ value }) => {
      const id = value.params['id']
      return of(new WorkshopGet({ id }))
    }),
  )
}
