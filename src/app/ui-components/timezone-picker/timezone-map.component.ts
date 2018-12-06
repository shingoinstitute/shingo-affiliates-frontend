// tslint:disable:max-classes-per-file
import {
  Component,
  Output,
  AfterViewInit,
  EventEmitter,
  ViewChildren,
  Directive,
  HostListener,
  QueryList,
  OnDestroy,
  HostBinding,
  ElementRef,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Observable, merge, Subscription } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { tuple } from '../../util/functional'
import { partitionMap } from '../../util/functional/Array'

// angular says QueryList is iterable, but doesn't provide types for it
declare module '@angular/core/src/linker/query_list' {
  interface QueryList<T> {
    [Symbol.iterator](): Iterator<T>
  }
}

@Directive({
  selector: '[data-tzid]',
})
export class DataTzidDirective {
  @Output()
  selected = new EventEmitter<string>()

  @HostBinding('class.active')
  active = false

  @HostListener('click', ['$event.target'])
  onclick(ev: SVGPathElement) {
    const tz = ev.dataset.tzid
    this.selected.emit(tz)
    this.active = true
  }

  constructor(private elem: ElementRef) {}

  get tzid(): string {
    return this.elem.nativeElement.dataset.tzid
  }
}

// tslint:disable-next-line:max-classes-per-file
@Component({
  selector: 'app-tz-map',
  // cannot use templateUrl with svg - see https://github.com/angular/angular-cli/issues/10567
  templateUrl: './timezone-map.svg.html',
  styles: [
    `
      path {
        transition: all 200ms ease-in-out;
        stroke: #7d7f81;
        fill: #7d7f81;
      }
      path[data-tzid] {
        fill: transparent;
        stroke: none;
      }
      path[data-tzid]:hover {
        fill: #26557f;
        stroke: #26557f;
        fill-opacity: 0.25;
        stroke-opacity: 1;
      }
      path[data-tzid].active {
        fill: #26557f;
        stroke: #26557f;
        fill-opacity: 0.45;
        stroke-opacity: 1;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimezoneMapComponent),
      multi: true,
    },
  ],
})
export class TimezoneMapComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Output()
  selection = new EventEmitter<string>()

  private selected?: string
  private onChange = (_val: string) => {}
  private onTouch = (_val: string) => {}
  private zoneListener!: Observable<
    [string, DataTzidDirective, DataTzidDirective[]]
  >
  private zoneListenerSub?: Subscription

  @ViewChildren(DataTzidDirective)
  private zoneElements!: QueryList<DataTzidDirective>

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const zones = this.zoneElements.map(elem =>
      elem.selected
        .asObservable()
        .pipe(
          map(selected =>
            tuple(selected, elem, this.zoneElements.filter(e => e !== elem)),
          ),
        ),
    )
    this.zoneListener = merge(...zones).pipe(
      distinctUntilChanged<[string, DataTzidDirective, DataTzidDirective[]]>(
        (x, y) => x[0] === y[0],
      ),
    )

    this.zoneListenerSub = this.zoneListener.subscribe(zoneInfo => {
      this.deactivateOthers(zoneInfo[2])
      this.handleSelect(zoneInfo[0])
    })

    if (this.selected) {
      const elem = this.zoneElements.find(e => e.tzid === this.selected)
      if (elem) {
        elem.active = true
        this.cdRef.detectChanges()
      }
    }
  }

  private deactivateOthers(otherZones: Iterable<DataTzidDirective>) {
    for (const elem of otherZones) {
      elem.active = false
    }
  }

  private activateWithId(id: string) {
    if (!this.zoneElements) return
    const {
      right: [elem],
      left: rest,
    } = partitionMap(this.zoneElements, e => e.tzid === id)
    if (elem) {
      elem.active = true
      this.deactivateOthers(rest)
    }
  }

  private handleSelect(zone: string) {
    // somehow highlight the selected zone path
    this.selected = zone
    this.selection.emit(this.selected)
    this.onChange(this.selected)
    this.onTouch(this.selected)
  }

  ngOnDestroy(): void {
    if (this.zoneListenerSub) {
      this.zoneListenerSub.unsubscribe()
    }
  }

  writeValue(obj: string): void {
    this.selected = obj
    if (typeof obj === 'string') {
      this.activateWithId(obj)
    }
  }

  set value(val: string | undefined) {
    if (val) {
      this.writeValue(val)
    } else {
      this.selected = undefined
      this.deactivateOthers(this.zoneElements)
    }
  }

  get value() {
    return this.selected
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
}
