import { Injectable } from '@angular/core'
import { Effect, Actions, ofType } from '@ngrx/effects'
import { WorkshopService } from '../services/workshop.service'
import {
  WorkshopGetAll,
  WorkshopApiActionTypes,
  WorkshopGet,
  WorkshopApiAction,
  WorkshopApiError,
  WorkshopApiSuccess,
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
  WorkshopRemoved,
  WorkshopUpdate,
  WorkshopAction,
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
import {
  editRoute,
  detailRoute,
  dashboardRoute,
} from '../workshops-routing.module'
import { isSome } from 'fp-ts/lib/Option'
import { or } from 'fp-ts/lib/function'
import { right } from '~app/util/functional/Either'
import { loadingAsync } from '~app/util/util'
import { Action, Store } from '@ngrx/store'
import { mergeDeepRight } from 'ramda'
import { workshop, WorkshopBase } from '../workshop.model'
import { State } from '../reducers'

const fromRouteConfig = (config: Route) => (r: ActivatedRouteSnapshot) =>
  !!(r.routeConfig && r.routeConfig.path === config.path)
const navAction = Lens.fromProp<
  RouterNavigationAction<SerializedRouterStateSnapshot>
>()

const handleQueryClientError = (selection: boolean = false) =>
  catchError(err =>
    [new WorkshopErrored(err) as Action].concat(
      selection ? [new WorkshopSelectErrored(err)] : [],
    ),
  )

// see https://blog.angularindepth.com/switchmap-bugs-b6de69155524
// for a great explanation on what mapping operators to use

@Injectable()
export class WorkshopEffects {
  constructor(
    private actions$: Actions<
      WorkshopApiAction | WorkshopAction | RouterNavigationAction
    >,
    private store: Store<State>,
    private workshopService: WorkshopService,
  ) {}

  @Effect()
  getAll$ = this.actions$.pipe(
    ofType(WorkshopApiActionTypes.WorkshopGetAll),
    exhaustMap(() =>
      this.workshopService.getAll().pipe(
        map(workshops => new WorkshopAdded({ workshops })),
        handleQueryClientError(),
      ),
    ),
  )

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType(WorkshopApiActionTypes.WorkshopGet),
    exhaustMap(({ payload: { id, selection } }) =>
      this.workshopService.getById(id).pipe(
        mergeMap(w =>
          [new WorkshopAdded({ workshops: [w] }) as Action].concat(
            selection ? [new WorkshopSelect(right(id))] : [],
          ),
        ),
        handleQueryClientError(selection),
      ),
    ),
  )

  @Effect()
  create$ = this.actions$.pipe(
    ofType(WorkshopApiActionTypes.WorkshopCreate),
    exhaustMap(action => {
      const {
        payload: { workshop: newWs },
      } = action
      const toAdd = mergeDeepRight(workshop(), newWs)
      return [
        new WorkshopAdded({ workshops: [toAdd as WorkshopBase] }),
        this.workshopService.create(newWs).pipe(
          map(result => [
            // tslint:disable-next-line: no-non-null-assertion
            new WorkshopUpdate({ id: toAdd.Id!, data: { Id: result.id } }),
            new WorkshopApiSuccess({ result, action }),
          ]),
          catchError(error => [
            // tslint:disable-next-line: no-non-null-assertion
            new WorkshopRemoved({ workshops: [toAdd.Id!] }),
            new WorkshopApiError({ error, action }),
          ]),
        ),
      ]
    }),
  )

  @Effect()
  update$ = this.actions$.pipe(
    ofType(WorkshopApiActionTypes.WorkshopUpdate),
    exhaustMap(action => {
      const {
        payload: { id, data },
      } = action
      const diff = { ...data, Id: id } as Overwrite<typeof data, { Id: string }>

      // TODO: Undo the optimistic update
      // it doesn't really matter as we refetch every pagechange anyway
      return [
        new WorkshopUpdate({ id, data: diff }),
        this.workshopService.update(diff).pipe(
          map(result => new WorkshopApiSuccess({ result, action })),
          catchError(error => [new WorkshopApiError({ error, action })]),
        ),
      ]
    }),
  )

  @Effect()
  navigateDetail$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
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

  @Effect()
  navigateDashboard$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    map(r =>
      navAction('payload')
        .compose(Lens.fromProp('routerState'))
        .compose(Lens.fromProp('root'))
        .composeOptional(Optional.fromNullableProp('firstChild'))
        .getOption(r)
        .map(fromRouteConfig(dashboardRoute)),
    ),
    filter(v => isSome(v) && v.value),
    switchMap(() => {
      return [new WorkshopGetAll()]
    }),
  )
}
