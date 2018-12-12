import { Observable, of, OperatorFunction } from 'rxjs'
import {
  debounceTime,
  map,
  mergeMap,
  bufferCount,
  startWith,
} from 'rxjs/operators'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '../../services/auth/auth.service'
import { Filter } from '../../services/filters/filter.abstract'
import { User } from '../../shared/models/user.model'
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service'
import {
  WorkshopProperties,
  WorkshopService,
  Workshop,
} from '../../services/workshop/workshop.service'

import { Moment } from 'moment'
import { FormControl, FormArray } from '@angular/forms'
import { just, nothing, map as mapMaybe } from '../../util/functional/Maybe'
import { DateRange } from '../../services/filters/workshops/workshop-date-range-filter'
import { tuple, fst, constant } from '../../util/functional'
import { filterMap, XOR, withoutTime } from '../../util/util'

const setFilterState = <T, C>(f: Filter<T, C>, criteria: C, active = false) => {
  f.criteria = criteria
  f.active = active
  return f
}

const noop = () => {}

type FilterCB = (change: boolean, filter: Filter<Workshop, any>) => void

@Component({
  selector: 'app-workshop-dashboard',
  templateUrl: './workshop-dashboard.component.html',
  styleUrls: ['./workshop-dashboard.component.scss'],
})
export class WorkshopDashboardComponent implements OnInit {
  public get showDateRange(): boolean {
    const idx = this.filters.findIndex(v => v[0].name === 'by Date')
    return idx > 0 && this.filterControls.at(idx).value
  }
  public get showStatusFilter(): boolean {
    const idx = this.filters.findIndex(v => v[0].name === 'by Status')
    return idx > 0 && this.filterControls.at(idx).value
  }
  public get showTextFilter(): boolean {
    const idx = this.filters.findIndex(v => v[0].name === 'by Text')
    return idx > 0 && this.filterControls.at(idx).value
  }

  public dateRange: DateRange = [null, null]
  public displayedColumns: WorkshopProperties[] = [
    'workshopType',
    'startDate',
    'endDate',
    'location',
    'instructors',
    'status',
    'verified',
    'actions',
  ]
  public allDisplayedColumns: WorkshopProperties[] = [
    'workshopType',
    'dueDate',
    'instructors',
    'location',
    'verified',
    'startDate',
    'endDate',
    'hostCity',
    'hostCountry',
    'daysLate',
    'status',
    'edit',
    'actions',
  ]
  public filters: Array<[Filter<Workshop, any>, FilterCB]> = [] // list of (filter object, change callback) pairs
  public get filterFns(): Array<Filter<Workshop, any>> {
    return this.filters.map(fst)
  }
  public statuses: Observable<string[]> = of([])
  public filterControls = new FormArray([])
  public textSearchControl = new FormControl('')
  public statusControl = new FormControl()
  public startDateControl = new FormControl()
  public endDateControl = new FormControl()

  public get user(): User {
    return this.route.snapshot.data['user']
  }

  constructor(
    public filterFactory: WorkshopFilterFactory,
    public _ws: WorkshopService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.statuses = this._ws
      .describe()
      .pipe(map(describe => this.getWorkshopStatuses(describe)))
  }

  public ngOnInit() {
    this.initFilters()

    // here we set up mappings between the filters criteria and form control values
    this.textSearchControl.valueChanges
      .pipe(debounceTime(150))
      .subscribe(value =>
        mapMaybe(this.findFilter('by Text'), ([f]) => {
          f.criteria = value
        }),
      )
    this.statusControl.valueChanges.subscribe(value =>
      mapMaybe(this.findFilter('by Status'), ([f]) => {
        f.criteria = {
          key: 'status',
          value,
        }
      }),
    )
    this.startDateControl.valueChanges.subscribe(value =>
      this.changeDateFilter(value, 0),
    )
    this.endDateControl.valueChanges.subscribe(value =>
      this.changeDateFilter(value, 1),
    )
    ;(this.filterControls.valueChanges as Observable<boolean[]>)
      .pipe(
        startWith(0), // start with some value, doesn't matter since we map it anyway
        // valueChanges only emits enabled controls, which breaks things because indexes change
        map(() => this.filterControls.getRawValue() as boolean[]),
        // buffer pairwise so that we recieve a stream of overlapping pairs
        bufferCount(2, 1) as OperatorFunction<
          boolean[],
          [boolean[], boolean[]]
        >,
        mergeMap(([prev, next]) =>
          filterMap(
            next,
            // if new value differs from previous value
            (v, i) => XOR(v, prev[i]),
            // then map to pair (value, filter)
            (v, i) => tuple(v, this.filters[i]),
          ),
        ),
      )
      .subscribe(([change, [filter, cb]]) => {
        filter.active = change
        cb(change, filter)
      })
  }

  private changeDateFilter(date: Moment | null, idx: 0 | 1 = 0) {
    if ((date && date.isValid) || date === null) {
      this.dateRange[idx] = date && date.toDate()
      mapMaybe(this.findFilter('by Date'), ([f]) => {
        f.criteria = this.dateRange
      })
    }
  }

  private addFilters(...fs: Array<[Filter<Workshop, any>, FilterCB]>) {
    fs.forEach(([f]) => {
      const control = new FormControl(f.getActive())
      this.filterControls.push(control)
    })
    this.filters.push(...fs)
  }

  private initFilters() {
    const filters: Array<[Filter<Workshop, any>, FilterCB]> = [
      tuple(
        setFilterState(
          this.filterFactory.createDateRangeFilter('by Upcoming Workshops'),
          [withoutTime(new Date()), null],
          true,
        ),
        this.toggleDisabled('by Action Pending', 'by Archived', 'by Date'),
      ) /* Upcoming */,
      tuple(this.filterFactory.createTextFilter('by Text'), noop), // Text Search
      tuple(
        this.filterFactory.createDateRangeFilter('by Date'),
        this.toggleDisabled('by Upcoming Workshops'),
      ), // Date range
    ]

    if (this.user.isAdmin) {
      filters.push(
        tuple(this.filterFactory.createPropertyFilter('by Status'), noop),
      ) // By Status (for admin)
    } else {
      filters.push(
        tuple(
          setFilterState(
            this.filterFactory.createPropertyFilter('by Action Pending'),
            {
              key: 'status',
              value: [
                'Action Pending',
                'Invoiced, Not Paid',
                'Finished, waiting for attendee list',
                'Awaiting Invoice',
              ],
            },
          ),
          this.toggleDisabled('by Upcoming Workshops', 'by Archived'),
        ), // Action Pending Property
        tuple(
          setFilterState(
            this.filterFactory.createPropertyFilter('by Archived'),
            {
              key: 'status',
              value: 'Archived',
            },
          ),
          this.toggleDisabled('by Upcoming Workshops', 'by Action Pending'),
        ), // Archived Workshops
      )
    }

    this.addFilters(...filters)

    // run the intial callbacks for all filters with their initial state
    filters.forEach(([f, cb]) => cb(f.getActive(), f))
  }

  private toggleDisabled(...toDisable: string[]): FilterCB {
    return (state: boolean) => {
      this.filters.forEach(([f], idx) => {
        if (toDisable.includes(f.name)) {
          const control = this.filterControls.at(idx)
          if (state) {
            control.disable({ emitEvent: false, onlySelf: true })
          } else {
            control.enable({ emitEvent: false, onlySelf: true })
          }
        }
      })
    }
  }

  private findFilter(name: string) {
    const filter = this.filters.find(([f]) => f.name === name)
    return typeof filter !== 'undefined' ? just(filter) : nothing
  }

  public goToWorkshopEdit(sfId: string) {
    this.router.navigateByUrl(`/workshops/${sfId}/edit`)
  }

  public clearFilters() {
    this.filterControls.patchValue(this.filters.map(constant(false)))
    this.clearDateFilter()
    this.textSearchControl.setValue('')
  }

  public clearDateFilter() {
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
