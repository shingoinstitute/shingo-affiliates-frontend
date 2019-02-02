import { Component, Injector } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { getWorkshops, State } from '~app/workshops/reducers'
import { mixinConnect } from '~app/util/store-connect/connect-mixin'

export const SelectAllWorkshopsMixin = mixinConnect(() => ({
  data$: select(getWorkshops()),
}))

@Component({
  selector: 'app-select-all-workshops',
  template: `
    <ng-content></ng-content>
  `,
})
export class SelectAllWorkshopsComponent extends SelectAllWorkshopsMixin {
  constructor(store: Store<State>) {
    super(store)
  }
}
