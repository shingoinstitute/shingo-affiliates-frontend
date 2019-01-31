import { Component, ContentChildren, QueryList } from '@angular/core'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import { Observable } from 'rxjs'
import { getCurrentWorkshop } from '~app/workshops/reducers'
import { AsyncResult } from '~app/util/types'
import { WorkshopBase } from '~app/workshops/workshop.model'
import {
  FocusLeftDirective,
  FocusRightDirective,
} from '~app/shared/components/focus-either.directive'

// analagous to a higher-order data-fetching component in react
// TODO: make this a better higher-order component by using ngComponentOutlet
@Component({
  selector: 'app-select-workshop',
  template: `
    <app-display-async [data]="workshopData$ | async">
      <!--
        angular is so dumb. in react this would totally work
        - the child elements would transparently be passed to the
        next component. Angular can't pass a template through
        without using ContentChildren because ng-content gets rendered
        once and then the templates get deleted because they werent used as outlets
        instead we have to duplicate half of the logic from display-async
        <ng-content></ng-content>
      -->
      <ng-container *ngFor="let child of rightRenders">
        <ng-template focusRight let-value>
          <ng-template
            [ngTemplateOutlet]="child.templateRef"
            [ngTemplateOutletContext]="{ $implicit: value }"
          ></ng-template>
        </ng-template>
      </ng-container>

      <ng-container *ngFor="let child of leftRenders">
        <ng-template focusLeft let-value>
          <ng-template
            [ngTemplateOutlet]="child.templateRef"
            [ngTemplateOutletContext]="{ $implicit: value }"
          ></ng-template>
        </ng-template>
      </ng-container>
    </app-display-async>
  `,
})
export class SelectWorkshopComponent {
  @ContentChildren(FocusRightDirective)
  rightRenders!: QueryList<FocusRightDirective>

  @ContentChildren(FocusLeftDirective)
  leftRenders!: QueryList<FocusLeftDirective>

  workshopData$: Observable<AsyncResult<WorkshopBase | undefined>>

  constructor(private store: Store<fromRoot.State>) {
    this.workshopData$ = this.store.pipe(select(getCurrentWorkshop))
  }
}
