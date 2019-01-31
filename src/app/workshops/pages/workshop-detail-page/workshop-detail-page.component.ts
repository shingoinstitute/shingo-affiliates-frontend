import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, EMPTY, of } from 'rxjs'
import { property } from '~app/util/functional'
import { map, mergeMap } from 'rxjs/operators'
import { isMaybeValue } from '~app/util/predicates'

// no selector since we only ever use as route page
@Component({
  templateUrl: './workshop-detail-page.component.html',
})
export class WorkshopDetailPageComponent {
  id$: Observable<string>
  page: 'edit' | 'detail'
  constructor(private route: ActivatedRoute) {
    this.id$ = this.route.params.pipe(
      map(property('id')),
      mergeMap(v => (isMaybeValue(v) ? EMPTY : of(v))),
    )

    const config = this.route.routeConfig
    // it would be better to just reference the exported editRoute from workshops-routing.module.ts
    // but then we get warnings about circular dependencies
    this.page =
      config && config.path === 'workshops/:id/edit' ? 'edit' : 'detail'
  }
}
