import {
  Component,
  ContentChildren,
  QueryList,
  Input,
  InjectionToken,
  Inject,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core'
import { isLeft } from '~app/util/functional/Either'
import { AsyncResult } from '~app/util/types'
import {
  FocusLeftDirective,
  FocusRightDirective,
} from '~app/shared/components/focus-either.directive'
import { failedAsync } from '~app/util/util'
import {
  Observable,
  BehaviorSubject,
  Subject,
  ReplaySubject,
  EMPTY,
  merge,
} from 'rxjs'

export const ASYNC_DATA = new InjectionToken<Observable<any>>('ASYNC_DATA', {
  providedIn: 'root',
  factory: () => EMPTY,
})

@Component({
  selector: 'app-display-async',
  templateUrl: './display-async.component.html',
})
export class DisplayAsyncComponent<Loaded, Empty = never> implements OnChanges {
  @ContentChildren(FocusRightDirective)
  rightRenders!: QueryList<FocusRightDirective>

  @ContentChildren(FocusLeftDirective)
  leftRenders!: QueryList<FocusLeftDirective>

  // tslint:disable-next-line: no-input-rename
  @Input('data') inputData: AsyncResult<Loaded, Empty> = failedAsync(
    'Data was not provided to DisplayAsyncComponent',
  )

  private dataSubject$: Subject<Loaded> = new ReplaySubject(1)

  get data$(): Observable<Loaded> {
    return merge(this.dataSubject$, this.injectedData)
  }

  constructor(
    @Inject(ASYNC_DATA) private injectedData: Observable<Loaded> = EMPTY,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    for (const name in changes) {
      if (changes.hasOwnProperty(name)) {
        console.log('got change', name, changes[name])
        if (name === 'inputData') {
          const change = changes[name]
          this.dataSubject$.next(change.currentValue)
        }
      }
    }
  }

  hasChildren(v: 'right' | 'left') {
    const list = v === 'right' ? this.rightRenders : this.leftRenders
    return !!(list && list.length > 0)
  }

  isLeft = isLeft
}
