import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core'

import { MatSort, MatPaginator } from '@angular/material'
import {
  WORKSHOP_COURSE_TYPES,
  WORKSHOP_STATUS_TYPES,
  WorkshopBase,
  endDate,
} from '~app/workshops/workshop.model'
// tslint:disable-next-line:no-duplicate-imports
import * as W from '~app/workshops/workshop.model'
import { Observable, BehaviorSubject } from 'rxjs'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import * as fromUser from '~app/user/reducers'
import { FormControl, FormGroup } from '@angular/forms'
import { KVMap } from '~app/util/types'
import { SortedDataSource } from '~app/util/SortedDataSource'
import { pipe, property } from '~app/util/functional'
import { ordNumValue } from '~app/util/functional/Ord'
import { ordString, ordNumber, ordBoolean, unsafeCompare } from 'fp-ts/lib/Ord'
import { invert, Ordering } from 'fp-ts/lib/Ordering'

export type WorkshopProperties =
  | 'actionType'
  | 'workshopType'
  | 'dueDate'
  | 'instructors'
  | 'location'
  | 'verified'
  | 'startDate'
  | 'endDate'
  | 'hostCity'
  | 'hostCountry'
  | 'daysLate'
  | 'status'
  | 'edit'
  | 'actions'

export const WORKSHOP_PROPERTY_MAP: KVMap<WorkshopProperties> = {
  actionType: 'actionType',
  actions: 'actions',
  daysLate: 'daysLate',
  dueDate: 'dueDate',
  edit: 'edit',
  endDate: 'endDate',
  hostCity: 'hostCity',
  hostCountry: 'hostCountry',
  instructors: 'instructors',
  location: 'location',
  startDate: 'startDate',
  status: 'status',
  verified: 'verified',
  workshopType: 'workshopType',
}

export const sortWorkshop = (sort: MatSort) => (
  data: WorkshopBase[],
): WorkshopBase[] => {
  if (!sort.active || sort.direction === '') {
    return data
  }

  return data.sort(
    pipe(
      (a, b): Ordering => {
        switch (sort.active as WorkshopProperties) {
          case 'actionType':
            return ordString.compare(W.status(a) || '', W.status(b) || '')
          case 'workshopType':
            return ordString.compare(W.type(a) || '', W.type(b) || '')
          case 'dueDate':
            return ordNumValue.compare(W.dueDate(a), W.dueDate(b))
          case 'instructors': {
            const instructorsA = W.instructors(a)
            const instructorsB = W.instructors(b)
            const [propA, propB] = [
              instructorsA ? instructorsA.length : 0,
              instructorsB ? instructorsB.length : 0,
            ]
            return ordNumber.compare(propA, propB)
          }
          case 'verified':
            return ordBoolean.compare(W.isVerified(a), W.isVerified(b))
          case 'startDate':
            return ordNumValue.compare(W.startDate(a), W.startDate(b))
          case 'endDate':
            return ordNumValue.compare(W.endDate(a), W.endDate(b))
          case 'hostCity':
            return ordString.compare(W.city(a) || '', W.city(b) || '')
          case 'hostCountry':
            return ordString.compare(W.country(a) || '', W.country(b) || '')
          case 'location':
            return ordString.compare(W.location(a), W.location(b))
          case 'status':
            return ordString.compare(W.status(a) || '', W.status(b) || '')
          default:
            return unsafeCompare(a, b)
        }
      },
      value => (sort.direction === 'asc' ? value : invert(value)),
    ),
  )
}

@Component({
  selector: 'app-workshop-data-table',
  templateUrl: './workshop-data-table.component.html',
  styleUrls: ['./workshop-data-table.component.scss'],
})
export class WorkshopDataTableComponent implements OnInit, OnChanges {
  @Input() workshops: WorkshopBase[] = []

  @Input()
  displayedColumns: WorkshopProperties[] = [
    'workshopType',
    'startDate',
    'endDate',
    'location',
    'instructors',
    'verified',
    'actions',
  ]
  @Input() isLoading = false

  @Output() editClick: EventEmitter<string> = new EventEmitter<string>()
  @Output() refresh: EventEmitter<void> = new EventEmitter()
  @Output() delete: EventEmitter<string> = new EventEmitter()

  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  dataSource!: SortedDataSource<WorkshopBase>
  properties = WORKSHOP_PROPERTY_MAP

  private selectedWorkshop?: WorkshopBase | null
  get selectedWorkshopId() {
    return (this.selectedWorkshop && this.selectedWorkshop.Id) || undefined
  }
  get Statuses() {
    return WORKSHOP_STATUS_TYPES
  }
  get CourseTypes() {
    return WORKSHOP_COURSE_TYPES
  }

  get dataSetSize$() {
    return this.dataSource.size
  }

  isAdmin$: Observable<boolean>

  // add module to class instance so it can be used in template
  W = W

  formGroup: FormGroup

  workshops$: BehaviorSubject<WorkshopBase[]> = new BehaviorSubject<
    WorkshopBase[]
  >([])

  constructor(store: Store<fromRoot.State>) {
    this.isAdmin$ = store.pipe(select(fromUser.isAdmin))
    this.formGroup = new FormGroup({
      type: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      status: new FormControl(),
    })
  }

  // we have to watch for changes since dataSource expects an observable
  // and we have a plain array - changes won't get propogated if we
  // pass of(this.workshops)
  ngOnChanges(changes: SimpleChanges) {
    for (const name in changes) {
      if (changes.hasOwnProperty(name)) {
        if (name === 'workshops') {
          const change = changes[name]
          this.workshops$.next(change.currentValue)
        }
      }
    }
  }

  ngOnInit() {
    this.workshops$.next(this.workshops)

    this.dataSource = new SortedDataSource(
      this.workshops$.asObservable(),
      sortWorkshop(this.sort),
      this.paginator,
      this.sort,
    )

    this.sort.sort({ id: 'startDate', start: 'asc', disableClear: false })
  }

  onRefresh() {
    this.refresh.emit()
  }

  workshopTrackBy = (_index: number, item: WorkshopBase) => {
    return item.Id
  }

  onEdit(workshopId: string) {
    this.editClick.emit(workshopId)
  }

  private patchForm() {
    this.formGroup.patchValue({
      type: this.selectedWorkshop && W.type(this.selectedWorkshop),
      startDate: this.selectedWorkshop && W.startDate(this.selectedWorkshop),
      endDate: this.selectedWorkshop && W.endDate(this.selectedWorkshop),
      status: this.selectedWorkshop && W.status(this.selectedWorkshop),
    })
  }

  inlineEdit(workshop: WorkshopBase) {
    this.selectedWorkshop = workshop
    this.patchForm()
  }

  resetForm() {
    this.selectedWorkshop = null
    this.patchForm()
  }

  saveChanges() {
    this.save()
    this.resetForm()
  }

  /**
   * @description Returns true if a pending action is due, where
   * 'due' is defined as being 1 or more days after the workshop's
   * end date.
   *
   * Workshops that fall in this category but are not "past due"
   * are considered to be within their grace period.
   */
  isDue(w: WorkshopBase): boolean {
    const daysLate = this.getDaysLate(w)
    return daysLate > 0 && daysLate <= 7
  }

  /**
   * @description Returns true if a pending action is past due,
   * where 'past due' is defined as being 7 or more days after
   * the workshop's end date.
   */
  isPastDue(w: WorkshopBase): boolean {
    return this.getDaysLate(w) > 7
  }

  /**
   * @description Returns a string describing how far a pending
   * action is past it's due date.
   */
  formatDaysLate(w: WorkshopBase): string {
    const daysLate = this.getDaysLate(w)
    if (daysLate < 1) {
      return `in ${Math.abs(daysLate)} days`
    }
    if (daysLate === 1) {
      return `1 day ago`
    }
    if (daysLate < 30) {
      return `${daysLate} days ago`
    }
    if (daysLate < 60) {
      return `1 month ago`
    }
    if (daysLate < 365) {
      return `${Math.floor(daysLate / 30)} months ago`
    }
    if (daysLate < 365 + 30) {
      return `1 year ago`
    }
    if (daysLate < 365 * 2) {
      return `1 year ${Math.floor((daysLate - 365) / 30)} months ago`
    }
    return `${Math.floor(daysLate / 365)} years ago`
  }

  /**
   * @description Returns the number of days a pending action
   * is past it's due date.
   */
  private getDaysLate(w: WorkshopBase): number {
    const _1day = 1000 * 60 * 60 * 24
    const now = Date.now()
    const dueAt = endDate(w).valueOf() + _1day * 7
    return Math.floor((now - dueAt) / _1day)
  }

  private save() {
    console.log(this.formGroup.value)
    // return a patch result from immer in an emitter
    throw new Error('Unimplemented')
  }

  onDelete(ws: WorkshopBase) {
    this.delete.emit(ws.Id)
  }

  getInstructors(workshop: WorkshopBase) {
    return W.instructors(workshop)
      .map(property('Name'))
      .join(', ')
  }
}
