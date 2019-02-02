// tslint:disable: max-classes-per-file
import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { getCurrentWorkshop } from '~app/workshops/reducers'
import { mixinConnect } from '~app/util/store-connect/connect-mixin'
import { State } from '../reducers/workshops.reducer'

export const SelectWorkshopMixin = mixinConnect(() => ({
  data$: select(getCurrentWorkshop),
}))

@Component({
  selector: 'app-select-workshop',
  template: `
    <ng-content></ng-content>
  `,
})
export class SelectWorkshopComponent extends SelectWorkshopMixin {
  constructor(store: Store<State>) {
    super(store)
  }
}
