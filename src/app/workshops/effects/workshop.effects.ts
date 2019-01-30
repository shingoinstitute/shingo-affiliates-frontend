import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { WorkshopService } from '../services/workshop.service'
import {
  WorkshopGetAll,
  WorkshopApiActionTypes,
  WorkshopGet,
  WorkshopUpdate,
} from '../actions/workshop-api.actions'
import {
  exhaustMap,
  map,
  catchError,
  filter,
  switchMap,
  mergeMap,
} from 'rxjs/operators'
import {
  WorkshopAdded,
  WorkshopErrored,
  WorkshopSelect,
  WorkshopSelectErrored,
} from '../actions/workshop.actions'
import { Overwrite } from '~app/util/types'
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
import { right } from '~app/util/functional/Either'
import { loadingAsync } from '~app/util/util'
import { Action } from '@ngrx/store'

const fromRouteConfig = (config: Route) => (r: ActivatedRouteSnapshot) =>
  !!(r.routeConfig && r.routeConfig.path === config.path)
const navAction = Lens.fromProp<
  RouterNavigationAction<SerializedRouterStateSnapshot>
>()

const handleError = (selection: boolean = false) =>
  catchError(err =>
    [new WorkshopErrored(err) as Action].concat(
      selection ? [new WorkshopSelectErrored(err)] : [],
    ),
  )

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
        handleError(),
      ),
    ),
  )

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType<WorkshopGet>(WorkshopApiActionTypes.WorkshopGet),
    exhaustMap(({ payload: { id, selection } }) =>
      this.workshopService.getById(id).pipe(
        mergeMap(w =>
          [new WorkshopAdded({ workshops: [w] }) as Action].concat(
            selection ? [new WorkshopSelect(right(id))] : [],
          ),
        ),
        handleError(selection),
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
      return [
        new WorkshopGet({ id, selection: true }),
        new WorkshopSelect(loadingAsync),
      ]
    }),
  )
}
