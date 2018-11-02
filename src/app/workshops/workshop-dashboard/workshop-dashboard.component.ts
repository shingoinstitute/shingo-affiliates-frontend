import {
  merge as observableMerge,
  from as observableFrom,
  fromEvent as observableFromEvent,
  Observable,
  of,
} from 'rxjs'

import { debounceTime, map } from 'rxjs/operators'
import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {
  MatDatepicker,
  MatCheckboxChange,
  MatCheckbox,
  MatSelect,
  MatSelectChange,
  MatDatepickerInputEvent,
} from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '../../services/auth/auth.service'
import { Filter } from '../../services/filters/filter.abstract'
import { User } from '../../shared/models/user.model'
import { WorkshopDataTableComponent } from '../../workshops/workshop-data-table/workshop-data-table.component'
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service'
import {
  WorkshopProperties,
  WorkshopService,
  Workshop,
} from '../../services/workshop/workshop.service'

import { Moment } from 'moment'
import { FormControl } from '@angular/forms'
import {
  just,
  nothing,
  Maybe,
  map as mapMaybe,
} from '../../util/functional/Maybe'
import { PropertyFilter } from '../../services/filters/property-filter'
import { DateRange } from '../../services/filters/workshops/workshop-date-range-filter'
import { catMaybes } from '../../util/functional/Array'

@Component({
  selector: 'app-workshop-dashboard',
  templateUrl: './workshop-dashboard.component.html',
  styleUrls: ['./workshop-dashboard.component.scss'],
})
export class WorkshopDashboardComponent implements OnInit, AfterViewInit {
  public get showDateRange(): boolean {
    return this._showDateRange
  }
  public get showFilters(): boolean {
    return this._showFilters
  }
  public get showStatusFilter(): boolean {
    return this._showStatusFilter
  }
  public get showTextFilter(): boolean {
    return this._showTextFilter
  }

  @ViewChildren(MatCheckbox)
  public selectedFilters: MatCheckbox[] = []

  public _showDateRange = false
  public _showFilters = false
  public _showStatusFilter = false
  public _showTextFilter = false
  public dateRange: DateRange = [null, null]
  public deactivated: Set<string> = new Set()
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
  public filterOption!: string
  public filterOptions: string[] = [] // the list of available filter options shown to the user
  public filters: Array<Filter<Workshop, any>> = [] // the list of filter objects used to do the actual filtering
  public statuses: Observable<string[]> = of([])
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
    this.setStatuses()
  }

  public ngOnInit() {
    this.initFilters()

    this.textSearchControl.valueChanges.pipe(debounceTime(150)).subscribe(() =>
      mapMaybe(this.findFilter('by Text'), f => {
        f.criteria = this.textSearchControl.value
      }),
    )
    this.statusControl.valueChanges.subscribe(value =>
      mapMaybe(
        this.findFilter('by Status') as Maybe<PropertyFilter<Workshop>>,
        f => {
          f.criteria = {
            key: 'status',
            value,
          }
        },
      ),
    )
    this.startDateControl.valueChanges.subscribe(value =>
      this.changeDateFilter(value, 0),
    )
    this.endDateControl.valueChanges.subscribe(value =>
      this.changeDateFilter(value, 1),
    )
  }

  private changeDateFilter(date: Moment, idx: 0 | 1 = 0) {
    if (date && date.isValid) {
      this.dateRange[idx] = date && date.toDate()
      mapMaybe(this.findFilter('by Date'), f => {
        f.criteria = this.dateRange
      })
    }
  }

  public ngAfterViewInit() {
    const observable: Array<
      Observable<MatCheckboxChange>
    > = this.selectedFilters.map(cbc => observableFrom(cbc.change))
    observableMerge(...observable).subscribe(event => this.filter(event))
  }

  private addFilters(...fs: Array<Filter<Workshop, any>>) {
    const names = fs.map(f => f.name)
    this.filterOptions.push(...names)
    this.filters.push(...fs)
  }

  public initFilters() {
    this.addFilters(
      this.filterFactory.createDateRangeFilter(
        'by Upcoming Workshops',
      ) /* Upcoming */,
    )

    if (this.user.isAdmin) {
      this.addFilters(this.filterFactory.createPropertyFilter('by Status')) // By Status (for admin)
    } else {
      this.addFilters(
        this.filterFactory.createPropertyFilter('by Action Pending'), // Action Pending Property
        this.filterFactory.createPropertyFilter('by Archived'), // Archived Workshops
      )
    }

    this.addFilters(
      this.filterFactory.createTextFilter('by Text'), // Text Search
      this.filterFactory.createDateRangeFilter('by Date'), // Date range
    )
  }

  private findFilter(name: string): Maybe<Filter<Workshop, any>> {
    const filter = this.filters.find(f => f.name === name)
    return typeof filter !== 'undefined' ? just(filter) : nothing
  }

  public goToWorkshopEdit(sfId: string) {
    this.router.navigateByUrl(`/workshops/${sfId}/edit`)
  }

  public removeDeactivated(items: string[]) {
    for (const item of items) {
      this.deactivated.delete(item)
    }
  }

  public filter(cbc: MatCheckboxChange) {
    const value = cbc.source.value
    let payload: { data?: any; deactivate: Array<Maybe<Filter<Workshop, any>>> }

    let deactivate: Array<Maybe<Filter<Workshop, any>>> = []
    switch (value) {
      case 'by Upcoming Workshops': // upcoming
        deactivate = ['by Action Pending', 'by Archived', 'by Date'].map(n =>
          this.findFilter(n),
        )
        if (cbc.checked)
          payload = { data: [new Date().withoutTime(), null], deactivate }
        break
      case 'by Action Pending': // actions pending
        deactivate = ['by Upcoming Workshops', 'by Archived'].map(n =>
          this.findFilter(n),
        )
        if (cbc.checked) {
          payload = {
            data: {
              key: 'status',
              value: [
                'Action Pending',
                'Invoiced, Not Paid',
                'Finished, waiting for attendee list',
                'Awaiting Invoice',
              ],
            },
            deactivate,
          }
        }
        break
      case 'by Archived': // archived
        deactivate = ['by Upcoming Workshops', 'by Action Pending'].map(n =>
          this.findFilter(n),
        )
        if (cbc.checked)
          payload = { data: { key: 'status', value: 'Archived' }, deactivate }
        break
      case 'by Status': // status
        this._showStatusFilter = cbc.checked
        break
      case 'by Text': // text
        this._showTextFilter = cbc.checked
        break
      case 'by Date': // date range
        deactivate = [this.findFilter('by Upcoming Workshops')]
        this._showDateRange = cbc.checked
        if (cbc.checked) payload = { deactivate }
    }

    if (cbc.checked) {
      mapMaybe(this.findFilter(cbc.source.value), f =>
        this.applyFilter(
          f,
          payload && {
            ...payload,
            deactivate: catMaybes(payload.deactivate),
          },
        ),
      )
    } else {
      this.removeDeactivated(catMaybes(deactivate).map(j => j.name))
      mapMaybe(this.findFilter(cbc.source.value), f => {
        f.active = false
      })
    }

    this.deactivateFilters()
  }

  public applyFilter(
    filter: Filter<Workshop, any>,
    payload?: null | { data?: any; deactivate: Array<Filter<Workshop, any>> },
  ) {
    filter.active = true
    if (payload) {
      if (payload.data) {
        filter.criteria = payload.data
      }
      const names = payload.deactivate.map(v => v.name)
      names.forEach(n => this.deactivated.add(n))
    }
  }

  public deactivateFilters() {
    this.selectedFilters.map(cb => {
      cb.disabled = this.deactivated.has(cb.value)
    })
    this.deactivated.forEach(name =>
      mapMaybe(this.findFilter(name), f => {
        f.active = false
      }),
    )
  }

  public clearFilters() {
    this.clearDateFilter()
    this.textSearchControl.setValue('')
    this._showDateRange = this._showTextFilter = this._showStatusFilter = false
    this.filters.map(f => {
      f.active = false
    })
    this.deactivated.clear()
    this.selectedFilters.map(cb => (cb.checked = false))
    this.deactivateFilters()
  }

  public clearDateFilter() {
    this.dateRange = [null, null]
    this.startDateControl.patchValue(null)
    this.endDateControl.patchValue(null)
    mapMaybe(this.findFilter('by Date'), f => {
      f.active = false
      f.criteria = this.dateRange
    })
  }

  public toggleFilters() {
    this._showFilters = !this._showFilters
  }

  public setStatuses() {
    this.statuses = this._ws
      .describe()
      .pipe(map(describe => this.getWorkshopStatuses(describe)))
  }

  public getWorkshopStatuses(describe: { [k: string]: any }): string[] {
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
