import { Observable, of, OperatorFunction, EMPTY } from 'rxjs'
import {
  debounceTime,
  map,
  mergeMap,
  bufferCount,
  startWith,
} from 'rxjs/operators'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Filter } from '~app/services/filters/filter.abstract'
import { WorkshopFilterFactory } from '~app/services/filters/workshops/workshop-filter-factory.service'

import { Moment } from 'moment'
import { FormControl, FormGroup } from '@angular/forms'
import { just, nothing, map as mapMaybe } from '~app/util/functional/Maybe'
import { DateRange } from '~app/services/filters/workshops/workshop-date-range-filter'
import { tuple as tp, fst, K, id } from '~app/util/functional'
import { XOR, withoutTime, recordEntries, toRecord } from '~app/util/util'
import { WorkshopBase } from '~app/workshops/workshop.model'
import { WorkshopService } from '~app/workshops/services/workshop.service'
import {
  WorkshopProperties,
  WORKSHOP_PROPERTY_MAP,
} from '~app/workshops/components/workshop-data-table/workshop-data-table.component'
import { Obj } from '~app/util/types'
import { filter as filterI, map as mapI } from '~app/util/iterable'
import { Store, select } from '@ngrx/store'
import { State } from '~app/reducers'
import * as fromUser from '~app/user/reducers'
import * as fromWorkshop from '~app/workshops/reducers'
import { matchC } from '~app/util/functional/Either'
import { EveryFilter } from '~app/services/filters/filter-every'

const setFilterState = <T, C>(f: Filter<T, C>, criteria: C, active = false) => {
  f.criteria = criteria
  f.active = active
  return f
}

const noop = () => {}

type FilterCB = (change: boolean, filter: Filter<WorkshopBase, any>) => void

@Component({
  templateUrl: './workshop-dashboard.component.html',
  styleUrls: ['./workshop-dashboard.component.scss'],
})
export class WorkshopDashboardComponent implements OnInit {
  // angular somehow calls getters before class construction
  // this should not be possible, since the getter resides on the class,
  // but that means any class properties will be undefined and the getter
  // will fail. Solution: throw in a bunch of null checks
  get showDateRange(): boolean {
    const control =
      this.filterControls && this.filterControls.controls['by Date']
    return !!(control && control.value)
  }
  get showStatusFilter(): boolean {
    const control =
      this.filterControls && this.filterControls.controls['by Status']
    return !!(control && control.value)
  }
  get showTextFilter(): boolean {
    const control =
      this.filterControls && this.filterControls.controls['by Text']
    return !!(control && control.value)
  }
  get filterFns(): Array<Filter<WorkshopBase, any>> {
    // angular somehow calls this getter before this.filters has been assigned a value
    // before the class has been constructed - no idea how that's possible
    // so we need this null check otherwise we get errors
    if (!this.filters) return []
    return Array.from(
      mapI(recordEntries(this.filters), ([, value]) => fst(value)),
    )
  }

  displayedColumns: WorkshopProperties[] = [
    'workshopType',
    'startDate',
    'endDate',
    'location',
    'instructors',
    'status',
    'verified',
    'actions',
  ]
  allDisplayedColumns: WorkshopProperties[] = Object.keys(
    WORKSHOP_PROPERTY_MAP,
  ) as WorkshopProperties[]
  statuses$: Observable<string[]> = of([])
  filterControls = new FormGroup({})
  textSearchControl = new FormControl('')
  statusControl = new FormControl()
  startDateControl = new FormControl()
  endDateControl = new FormControl()
  workshops$: Observable<WorkshopBase[]> = of([])
  isLoading$ = of(false)
  error$: Observable<unknown> = EMPTY
  private dateRange: DateRange = [null, null]
  private isAdmin$: Observable<boolean>
  private parentFilter: Filter<WorkshopBase, Array<Filter<WorkshopBase, any>>>
  private filters: Record<string, [Filter<WorkshopBase, any>, FilterCB]> = {} // record of names to (filter object, change callback) pairs

  constructor(
    private filterFactory: WorkshopFilterFactory,
    private _ws: WorkshopService,
    private router: Router,
    private store: Store<State>,
  ) {
    this.isAdmin$ = this.store.pipe(select(fromUser.isAdmin))
    this.statuses$ = this._ws
      .describe()
      .pipe(map(describe => this.getWorkshopStatuses(describe)))

    const workshopData = this.store.pipe(select(fromWorkshop.getWorkshops()))

    this.parentFilter = new EveryFilter('Every Filter')
    this.parentFilter.active = true

    this.isLoading$ = workshopData.pipe(
      map(matchC(({ tag }) => tag === 'loading', K(false))),
    )

    this.workshops$ = workshopData.pipe(
      map(matchC(() => [] as WorkshopBase[], id)),
      mergeMap(data => this.parentFilter.filter(data)),
    )
  }

  ngOnInit() {
    this.initFilters()

    // here we set up mappings between the filters criteria and form control values
    this.textSearchControl.valueChanges
      .pipe(
        debounceTime(150),
        map(v => tp(v, this.findFilter('by Text'))),
      )
      .subscribe(([value, filter]) =>
        mapMaybe(filter, ([f]) => {
          f.criteria = value
        }),
      )
    this.statusControl.valueChanges
      .pipe(map(v => tp(v, this.findFilter('by Status'))))
      .subscribe(([value, filter]) =>
        mapMaybe(filter, ([f]) => {
          f.criteria = {
            key: 'status',
            value,
          }
        }),
      )
    this.startDateControl.valueChanges
      .pipe(map(v => tp(v, this.findFilter('by Date'))))
      .subscribe(([value, filter]) =>
        mapMaybe(filter, ([f]) => this.changeDateFilter(f, value, 0)),
      )
    this.endDateControl.valueChanges
      .pipe(map(v => tp(v, this.findFilter('by Date'))))
      .subscribe(([value, filter]) =>
        mapMaybe(filter, ([f]) => this.changeDateFilter(f, value, 1)),
      )
    ;(this.filterControls.valueChanges as Observable<boolean[]>)
      .pipe(
        startWith(0), // start with some value, doesn't matter since we map it anyway
        // valueChanges only emits enabled controls, which breaks things because indexes change
        map(() => this.filterControls.getRawValue() as Obj<boolean>),
        // buffer pairwise so that we recieve a stream of overlapping pairs
        bufferCount(2, 1) as OperatorFunction<
          Obj<boolean>,
          [Obj<boolean>, Obj<boolean>]
        >,
        mergeMap(([prev, next]) =>
          mapI(
            // if new value differs from previous value
            filterI(recordEntries(next), ([k, v]) => XOR(v, prev[k])),
            // then map to pair (value, filter)
            ([k, v]) => tp(v, this.findFilter(k)),
          ),
        ),
      )
      .subscribe(([change, mfilter]) =>
        mapMaybe(mfilter, ([filter, cb]) => {
          filter.active = change
          cb(change, filter)
        }),
      )
  }

  private changeDateFilter(
    filter: Filter<WorkshopBase, any>,
    date: Moment | null,
    idx: 0 | 1 = 0,
  ) {
    if ((date && date.isValid) || date === null) {
      this.dateRange[idx] = date && date.toDate()
      filter.criteria = this.dateRange
    }
  }

  private addFilters(...fs: Array<[Filter<WorkshopBase, any>, FilterCB]>) {
    fs.map(fpair => {
      const [f] = fpair
      if (this.filterControls.controls[f.name]) {
        this.filterControls.removeControl(f.name)
      }

      // add the control as side effect
      // avoids iterating array twice
      const control = new FormControl(f.getActive())
      this.filterControls.addControl(f.name, control)

      // add to filters record
      this.filters[f.name] = fpair
      this.parentFilter.criteria = this.filterFns
    })
  }

  private removeFilters(...fs: Array<[Filter<WorkshopBase, any>, FilterCB]>) {
    // an iterable doesn't execute until it's spread
    // mapI(fs, fpair => {
    fs.map(fpair => {
      const [f] = fpair
      if (!this.filterControls.controls[f.name]) return

      // remove the control
      this.filterControls.removeControl(f.name)

      // delete the entry from the filters record
      delete this.filters[f.name]
      this.parentFilter.criteria = this.filterFns
    })
  }

  private initFilters() {
    const baseFilters: ReadonlyArray<[Filter<WorkshopBase, any>, FilterCB]> = [
      tp(
        setFilterState(
          this.filterFactory.createDateRangeFilter('by Upcoming Workshops'),
          [withoutTime(new Date()), null],
          true,
        ),
        this.toggleDisabled('by Action Pending', 'by Archived', 'by Date'),
      ), // Upcoming
      tp(this.filterFactory.createTextFilter('by Text'), noop), // Text Search
      tp(
        this.filterFactory.createDateRangeFilter('by Date'),
        this.toggleDisabled('by Upcoming Workshops'),
      ), // Date range
    ]

    const adminFilters = [
      tp(this.filterFactory.createPropertyFilter('by Status'), noop),
    ]

    const nonAdminFilters = [
      tp(
        this.filterFactory
          .createPropertyFilter('by Action Pending')
          .setCriteria('Status__c', [
            'Action Pending',
            'Invoiced, Not Paid',
            // 'Finished, waiting for attendee list',
            // 'Awaiting Invoice',
          ]),
        this.toggleDisabled('by Upcoming Workshops', 'by Archived'),
      ), // Action Pending Property
      tp(
        this.filterFactory
          .createPropertyFilter('by Archived')
          .setCriteria('Status__c', 'Archived'),
        this.toggleDisabled('by Upcoming Workshops', 'by Action Pending'),
      ), // Archived Workshops
    ]

    this.isAdmin$.subscribe(isAdmin => {
      this.addFilters(...(isAdmin ? adminFilters : nonAdminFilters))
      this.removeFilters(...(isAdmin ? nonAdminFilters : adminFilters))
    })

    baseFilters.forEach(([f, cb]) => cb(f.getActive(), f))
    this.addFilters(...baseFilters)
  }

  private toggleDisabled(...toDisable: string[]): FilterCB {
    return (state: boolean) => {
      toDisable.forEach(name => {
        mapMaybe(this.findFilter(name), ([f]) => {
          const control = this.filterControls.controls[f.name]
          if (state) {
            control.disable({ emitEvent: false, onlySelf: true })
          } else {
            control.enable({ emitEvent: false, onlySelf: true })
          }
        })
      })
    }
  }

  private findFilter(name: string | number) {
    const f = this.filters[name]
    return typeof f !== 'undefined' ? just(f) : nothing
  }

  goToWorkshopEdit(sfId: string) {
    this.router.navigateByUrl(`/workshops/${sfId}/edit`)
  }

  clearFilters() {
    this.filterControls.patchValue(
      toRecord(mapI(recordEntries(this.filters), ([n]) => tp(n, false))),
    )
    this.clearDateFilter()
    this.textSearchControl.setValue('')
  }

  clearDateFilter() {
    this.startDateControl.setValue(null)
    this.endDateControl.setValue(null)
  }

  private getWorkshopStatuses(describe: { [k: string]: any }): string[] {
    try {
      return describe.status.picklistValues.map(
        (option: { label: string }) => option.label,
      )
    } catch (e) {
      console.warn(
        'Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.',
        describe,
      )
      return []
    }
  }
}
