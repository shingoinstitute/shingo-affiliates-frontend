import { Component, ContentChildren, QueryList, Input } from '@angular/core'
import { isLeft } from '~app/util/functional/Either'
import { AsyncResult } from '~app/util/types'
import {
  FocusLeftDirective,
  FocusRightDirective,
} from '~app/shared/components/focus-either.directive'
import { failedAsync } from '~app/util/util'

@Component({
  selector: 'app-display-async',
  templateUrl: './display-async.component.html',
})
export class DisplayAsyncComponent<Loaded, Empty = never> {
  @ContentChildren(FocusRightDirective)
  rightRenders!: QueryList<FocusRightDirective>

  @ContentChildren(FocusLeftDirective)
  leftRenders!: QueryList<FocusLeftDirective>

  // tslint:disable-next-line: no-input-rename
  @Input('data') data: AsyncResult<Loaded, Empty> = failedAsync(
    'Data was not provided to DisplayAsyncComponent',
  )

  hasChildren(v: 'right' | 'left') {
    const list = v === 'right' ? this.rightRenders : this.leftRenders
    return !!(list && list.length > 0)
  }

  isLeft = isLeft
}
