import {
  merge as observableMerge,
  from as observableFrom,
  fromEvent as observableFromEvent,
  Observable,
} from 'rxjs'

import { debounceTime } from 'rxjs/operators'
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

import { at } from 'lodash'
import { Moment } from 'moment'
import { FormControl } from '@angular/forms'
import {
  just,
  nothing,
  Maybe,
  map as mapMaybe,
  justs,
} from '../../util/functional/Maybe'
import { PropertyFilter } from '../../services/filters/property-filter'
import { snd } from '../../util/functional'
import { DateRange } from '../../services/filters/workshops/workshop-date-range-filter'

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

  @ViewChild('startDateFilterPicker')
  public startDFPicker!: MatDatepicker<Date>
  @ViewChild('endDateFilterPicker')
  public endDFPicker!: MatDatepicker<Date>

  @ViewChild('startDFInput')
  public startDFInput!: ElementRef
  @ViewChild('endDFInput')
  public endDFInput!: ElementRef

  @ViewChild(MatSelect)
  public statusSelect!: MatSelect

  @ViewChild(WorkshopDataTableComponent)
  public workshopTable!: WorkshopDataTableComponent

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
  public selectedStatuses: any[] = []
  public statuses: string[] = []
  public textSearchControl = new FormControl('')

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

  public endDateChanged($event: MatDatepickerInputEvent<Moment>) {
    const date = $event.value
    const drIndex = this.filters.findIndex(f => f.name === 'by Date')
    this.dateRange[1] = date && date.toDate()
    this.filters[drIndex].criteria = this.dateRange
  }

  public startDateChanged($event: MatDatepickerInputEvent<Moment>) {
    const date = $event.value
    const drIndex = this.filters.findIndex(f => f.name === 'by Date')
    this.dateRange[0] = date && date.toDate()
    this.filters[drIndex].criteria = this.dateRange
  }

  public ngOnInit() {
    this.initFilters()

    const textIndex = this.filters.findIndex(f => f.name === 'by Text')
    this.textSearchControl.valueChanges
      .pipe(debounceTime(150))
      .subscribe(event => {
        console.log('got searchEvent', event)
        this.filters[textIndex].criteria = this.textSearchControl.value
      })
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

  public selectedStatusChanged(_event: MatSelectChange) {
    mapMaybe(
      this.findFilter('by Status') as Maybe<PropertyFilter<Workshop>>,
      (f: PropertyFilter<Workshop>) =>
        (f.criteria = {
          key: 'status',
          value: this.selectedStatuses,
        }),
    )
  }

  public removeDeactivated(items: string[]) {
    for (const item of items) {
      this.deactivated.delete(item)
    }
  }

  public filter(cbc: MatCheckboxChange) {
    const value = cbc.source.value
    let payload: { data: any; deactivate: Array<Maybe<Filter<Workshop, any>>> }

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
        if (cbc.checked)
          payload = {
            data: { key: 'status', value: this.selectedStatuses },
            deactivate,
          }
        break
      case 'by Text': // text
        this._showTextFilter = cbc.checked
        if (cbc.checked && this.textSearchControl.value)
          payload = { data: this.textSearchControl.value, deactivate }
        break
      case 'by Date': // date range
        deactivate = [this.findFilter('by Upcoming Workshops')]
        this._showDateRange = cbc.checked
        if (cbc.checked) payload = { data: this.dateRange, deactivate }
    }

    if (cbc.checked) {
      mapMaybe(
        this.findFilter(cbc.source.value),
        // tslint:disable:no-non-null-assertion
        f =>
          this.applyFilter(f, {
            ...payload!,
            deactivate: justs(payload!.deactivate).map(snd),
          }),
        // tslint:enable:no-non-null-assertion
      )
    } else {
      this.removeDeactivated(justs(deactivate).map(j => j[1].name))
      mapMaybe(this.findFilter(cbc.source.value), f => {
        f.active = false
      })
    }

    this.deactivateFilters()
  }

  public applyFilter(
    filter: Filter<Workshop, any>,
    {
      data,
      deactivate,
    }: { data: any; deactivate: Array<Filter<Workshop, any>> },
  ) {
    filter.criteria = data
    const names = deactivate.map(v => v.name)
    names.forEach(n => this.deactivated.add(n))
  }

  public deactivateFilters() {
    this.selectedFilters.map(cb => {
      cb.disabled = this.deactivated.has(cb.value)
    })
  }

  public clearFilters() {
    this.dateRange = [null, null]
    this.textSearchControl.setValue('')
    this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null
    this.startDFPicker._selected = this.endDFPicker._selected = null
    this._showDateRange = this._showTextFilter = this._showStatusFilter = false
    this.filters.map(f => {
      f.active = false
    })
    this.deactivated.clear()
    this.selectedFilters.map(cb => (cb.checked = false))
    this.selectedStatuses = []
    this.deactivateFilters()
  }

  public clearDateFilter() {
    this.dateRange = [null, null]
    this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null
    this.startDFPicker._selected = this.endDFPicker._selected = null
    const index = this.filters.findIndex(f => f.name === 'by Date')
    this.filters[index].active = false
  }

  public toggleFilters() {
    this._showFilters = !this._showFilters
  }

  public setStatuses() {
    this._ws
      .describe()
      .subscribe(describe => this.getWorkshopStatuses(describe))
  }

  public getWorkshopStatuses(describe: { [k: string]: any }) {
    try {
      this.statuses = describe.status.picklistValues.map(
        (option: { label: string }) => option.label,
      )
    } catch (e) {
      console.warn(
        'Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.',
        describe,
      )
    }
  }
}
