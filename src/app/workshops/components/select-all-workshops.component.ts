import { Component, ContentChildren, QueryList } from '@angular/core'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import { Observable } from 'rxjs'
import { getWorkshops } from '~app/workshops/reducers'
import { AsyncResult } from '~app/util/types'
import { WorkshopBase } from '~app/workshops/workshop.model'
import {
  FocusLeftDirective,
  FocusRightDirective,
} from '~app/shared/components/focus-either.directive'

@Component({
  selector: 'app-select-all-workshops',
  template: `
    <app-display-async [data]="workshopData$ | async">
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
export class SelectAllWorkshopsComponent {
  @ContentChildren(FocusRightDirective)
  rightRenders!: QueryList<FocusRightDirective>

  @ContentChildren(FocusLeftDirective)
  leftRenders!: QueryList<FocusLeftDirective>

  workshopData$: Observable<AsyncResult<WorkshopBase[]>>

  constructor(private store: Store<fromRoot.State>) {
    this.workshopData$ = this.store.pipe(select(getWorkshops()))
  }
}
