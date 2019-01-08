import { Injectable } from '@angular/core'
import { WorkshopsModule } from '../workshops.module'
import { WorkshopBase } from '../workshop.model'
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { Observable, EMPTY, of } from 'rxjs'
import { State, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import { getWorkshops } from '../reducers'
import { mergeMap } from 'rxjs/operators'

@Injectable({
  providedIn: WorkshopsModule,
})
export class WorkshopResolver implements Resolve<Readonly<WorkshopBase>> {
  constructor(private state: State<fromRoot.State>) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Readonly<WorkshopBase>> {
    const id = route.params.id
    return this.state.pipe(
      select(getWorkshops(w => w.Id === id)),
      mergeMap(([w]) => (typeof w === 'undefined' ? EMPTY : of(w))),
    )
  }
}
