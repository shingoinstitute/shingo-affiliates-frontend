// tslint:disable:max-classes-per-file
import {
  distinctUntilChanged,
  debounceTime,
  filter,
  mergeMap,
  tap,
} from 'rxjs/operators'
import { Observable, of, Subscription } from 'rxjs'
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  TemplateRef,
  ContentChild,
  Directive,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core'
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'

import { Affiliate } from '../../../affiliates/affiliate.model'

import { Facilitator } from '../../../facilitators/facilitator.model'

import { CourseManager } from '../../../workshops/course-manager.model'

@Directive({
  selector: '[search-autocomplete]',
})
export class SearchAutocompleteRenderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[search-selection]',
})
export class SearchSelectionRenderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchComponent),
    },
  ],
})
export class SearchComponent<T> implements ControlValueAccessor, OnDestroy {
  @ContentChild(SearchSelectionRenderDirective)
  listRender?: SearchSelectionRenderDirective

  @ContentChild(SearchAutocompleteRenderDirective)
  autoRender?: SearchAutocompleteRenderDirective

  @Input()
  searchFn = (_query: string) => of([] as T[])
  @Input()
  placeholder = 'Search...'
  @Input()
  displayWith = (o: T) => String(o)

  // Should the lookup component input field be required?
  @Input()
  isRequired = true

  @Input()
  multi = false

  @Input()
  showSelection = true

  @Output()
  selected = new EventEmitter<T>()
  @Output()
  removed = new EventEmitter<T>()
  @Output()
  changed = new EventEmitter<T | T[]>()
  @Output()
  query = new EventEmitter<string>()

  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>

  get textOnly() {
    return !this.showSelection && !this.multi
  }

  searchInputControl = new FormControl()

  objects$: Observable<T[]> = of([])
  selectedObjects: T[] = []
  get value() {
    if (this.textOnly) {
      return this.searchInputControl.value
    }
    return this.multi ? this.selectedObjects : this.selectedObjects[0]
  }
  set value(v: T | T[]) {
    if (typeof v === 'string' && this.textOnly) {
      this.searchInputControl.setValue(v, { emitEvent: false })
      this.changeRef.detectChanges()
    } else {
      this.selectedObjects = (v && (Array.isArray(v) ? v : [v])) || []
    }
  }

  isSearching = false
  private _disabled = false
  get disabled() {
    return this._disabled
  }
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled
    if (isDisabled) {
      this.searchInputControl.disable()
    } else {
      this.searchInputControl.enable()
    }
  }

  private searchSub?: Subscription
  private onChange = (_v: T | T[]) => {}
  private onTouch = () => {}

  touch() {
    this.onTouch()
  }

  writeValue(value: T | T[] | null | undefined): void {
    this.value = value || []
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  constructor(private changeRef: ChangeDetectorRef) {
    this.objects$ = this.searchInputControl.valueChanges.pipe(
      tap(value => {
        if (this.textOnly) {
          this.onChange(value)
        }
      }),
      filter(query => query && query.length > 2),
      debounceTime(250),
      distinctUntilChanged(),
      mergeMap(v => this.handleQuery(v)),
    )

    this.searchSub = this.objects$.subscribe(
      () => {
        this.isSearching = false
      },
      err => {
        this.isSearching = false
        console.error(err)
      },
    )
  }

  ngOnDestroy(): void {
    if (this.searchSub) this.searchSub.unsubscribe()
  }

  private handleQuery(query: string): Observable<T[]> {
    this.isSearching = true
    this.query.emit(query)
    return this.searchFn(query)
  }

  private addValue(v: T) {
    if (this.multi) {
      this.selectedObjects.push(v)
    } else {
      this.selectedObjects[0] = v
    }
    this.selected.emit(v)
    this.onTouch()
    if (!this.textOnly) {
      this.changed.emit(this.value)
      this.onChange(this.value)
    }
  }

  onSelectChange(selection: T) {
    this.addValue(selection)
    if (!this.textOnly) {
      this.searchInput.nativeElement.value = ''
      this.searchInputControl.setValue('')
    }
  }

  removeItem(v: T) {
    this.value = this.selectedObjects.filter(val => val !== v)
    this.removed.emit(v)
    this.changed.emit(this.value)
    this.onChange(this.value)
    this.onTouch()
  }

  displayObjFn(obj: any): string {
    if (obj instanceof Facilitator) {
      return `<div class="search-holder">
        ${
          obj.photo !== ''
            ? '<img class="thumbnail-search profile" src="' + obj.photo + '" />'
            : ''
        }
        ${obj.name}${
        obj.email !== ''
          ? '&nbsp;:<span class="small-light-text">&emsp;' + obj.email
          : ''
      }</span>
      </div>`
    } else if (obj instanceof Affiliate) {
      return `<div class="search-holder">
        ${
          obj.logo !== ''
            ? '<img class="thumbnail-search" src="' + obj.logo + '" />'
            : ''
        }
        ${obj.name}${
        obj.summary === null || obj.summary === 'null' || obj.summary === ''
          ? ''
          : '&nbsp;:<span class="small-light-text">&emsp;' +
            this.truncate(obj.summary.replace(/(<([^>]+)>)/gi, ''), 25)
      }</span>
      </div>`
    } else if (obj instanceof CourseManager) {
      return `<div class="search-holder">
        ${obj.name}${
        obj.email !== ''
          ? '&nbsp;:<span class="small-light-text">&emsp;' + obj.email
          : ''
      }</span>
      </div>`
    } else if (typeof obj.name !== 'undefined') return obj.name
    else if (typeof obj.email !== 'undefined') return obj.name
    else if (typeof obj === 'string') return obj
    else return String(obj)
  }

  private truncate(str: string, len: number, postfix: string = '...'): string {
    if (str.length <= len) return str
    return str.substr(0, len) + postfix
  }
}
