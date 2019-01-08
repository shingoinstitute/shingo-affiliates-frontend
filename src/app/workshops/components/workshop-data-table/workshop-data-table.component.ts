import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core'

import {
  WorkshopDataSource,
  WorkshopTrackByStrategy,
} from '~app/services/workshop/workshop-data-source.service'
import { DataProvider } from '~app/services/data-provider/data-provider.service'
import { DataProviderFactory } from '~app/services/data-provider/data-provider-factory.service'
import { WorkshopService } from '~app/workshops/services/workshop.service'
import { MatSort, MatPaginator, MatDialog } from '@angular/material'
import {
  WORKSHOP_COURSE_TYPES,
  WORKSHOP_STATUS_TYPES,
  WorkshopBase,
  endDate,
} from '~app/workshops/workshop.model'
// tslint:disable-next-line:no-duplicate-imports
import * as W from '~app/workshops/workshop.model'
import { Filter } from '~app/services/filters/filter.abstract'
import {
  AlertDialogComponent,
  AlertDialogData,
} from '~app/shared/components/alert-dialog/alert-dialog.component'
import { Observable, of } from 'rxjs'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '~app/reducers'
import * as fromUser from '~app/user/reducers'
import { FormControl, FormGroup } from '@angular/forms'
import { KVMap } from '~app/util/types'

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
@Component({
  selector: 'app-workshop-data-table',
  templateUrl: './workshop-data-table.component.html',
  styleUrls: ['./workshop-data-table.component.scss'],
})
export class WorkshopDataTableComponent implements OnInit {
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
  @Input()
  dataSource?: WorkshopDataSource
  @Input()
  filters: Array<Filter<WorkshopBase, any>> = []
  @Output()
  editClick: EventEmitter<string> = new EventEmitter<string>()

  @ViewChild(MatSort)
  sort!: MatSort
  @ViewChild(MatPaginator)
  paginator!: MatPaginator

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
    return this._workshopDataProvider.size
  }

  isLoading$: Observable<boolean> = of(false)
  isAdmin$: Observable<boolean>
  private _workshopDataProvider: DataProvider<WorkshopService, WorkshopBase>
  private trackByStrategy: WorkshopTrackByStrategy = 'id'

  // add module to class instance so it can be used in template
  W = W

  formGroup: FormGroup

  constructor(
    providerFactory: DataProviderFactory,
    private dialog: MatDialog,
    store: Store<fromRoot.State>,
  ) {
    this.isAdmin$ = store.pipe(select(fromUser.isAdmin))
    this._workshopDataProvider = providerFactory.getWorkshopDataProvider()
    this.isLoading$ = this._workshopDataProvider.dataLoading
    this.formGroup = new FormGroup({
      type: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      status: new FormControl(),
    })
  }

  ngOnInit() {
    if (!this.dataSource) {
      this.dataSource = new WorkshopDataSource(
        this._workshopDataProvider,
        this.paginator,
        this.sort,
      )
    } else {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }

    if (this.filters) this.dataSource.addFilters(this.filters)

    this.sort.sort({ id: 'startDate', start: 'asc', disableClear: false })
  }

  refresh() {
    this._workshopDataProvider.refresh()
  }

  workshopTrackBy = (index: number, item: WorkshopBase) => {
    switch (this.trackByStrategy) {
      case 'id':
        return item.Id
      case 'reference':
        return item
      case 'index':
        return index
    }
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
    throw new Error('Unimplemented')
    // this.isLoading = true
    // this._ws.update(ws).subscribe(res => {
    //   this.isLoading = false
    // })
  }

  delete(ws: WorkshopBase) {
    const data: AlertDialogData = {
      sfObject: ws,
      title: 'Delete Workshop?',
      message: 'This will permanently delete the selected workshop.',
      destructive: true,
      confirmText: 'Yes, Delete Workshop',
      cancelText: 'No, Keep Workshop',
    }
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        throw new Error('Unimplemented')
        // this.isLoading = true
        // this._ws.delete(ws).subscribe(res => {
        //   this.isLoading = false
        //   this.refresh()
        // })
      }
    })
  }
}
