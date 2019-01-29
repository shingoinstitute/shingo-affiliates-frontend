import { Component } from '@angular/core'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import { Observable, EMPTY, of } from 'rxjs'
import { getCurrentWorkshop } from '~app/workshops/reducers'
import { ActivatedRoute } from '@angular/router'
import { map, mergeMap } from 'rxjs/operators'
import { property } from '~app/util/functional'
import { isMaybeValue } from '~app/util/predicates'
import { isLeft } from '~app/util/functional/Either'
import { AsyncResult } from '~app/util/types'
import { WorkshopBase } from '~app/workshops/workshop.model'

@Component({
  selector: 'app-workshop-focus',
  templateUrl: './workshop-focus.component.html',
})
export class WorkshopFocusComponent {
  workshopData$: Observable<AsyncResult<WorkshopBase | undefined>>
  id$: Observable<string>
  page: 'edit' | 'detail'

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>,
  ) {
    this.id$ = this.route.params.pipe(
      map(property('id')),
      mergeMap(v => (isMaybeValue(v) ? EMPTY : of(v))),
    )

    const config = this.route.routeConfig
    // it would be better to just reference the exported editRoute from workshops-routing.module.ts
    // but then we get warnings about circular dependencies
    this.page =
      config && config.path === 'workshops/:id/edit' ? 'edit' : 'detail'

    this.workshopData$ = this.store.pipe(select(getCurrentWorkshop))
  }

  isLeft = isLeft
}
