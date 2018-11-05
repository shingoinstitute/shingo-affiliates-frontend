import { AuthService } from '../../services/auth/auth.service'
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core'
import { MatDialog, MatPaginator, MatSort } from '@angular/material'

import { DataProvider } from '../../services/data-provider/data-provider.service'
import { FacilitatorService } from '../../services/facilitator/facilitator.service'
import { Facilitator, FacilitatorRoleType } from '../facilitator.model'
import { FacilitatorDataSource } from '../../services/facilitator/facilitator-data-source.service'
import { DataProviderFactory } from '../../services/data-provider/data-provider-factory.service'
import { IconType } from '../../shared/components/icon-legend/icon-legend.component'
import { FacilitatorFormComponent } from '../facilitator-form/facilitator-form.component'
import { RouterService } from '../../services/router/router.service'
import { Filter } from '../../services/filters/filter.abstract'

@Component({
  selector: 'app-facilitator-data-table',
  templateUrl: './facilitator-data-table.component.html',
  styleUrls: ['./facilitator-data-table.component.scss'],
})
export class FacilitatorDataTableComponent implements OnInit {
  @Output()
  public loadCompleted = new EventEmitter<void>()
  @Output()
  public deleted = new EventEmitter<Facilitator>()
  @Output()
  public disabled = new EventEmitter<Facilitator>()
  @Output()
  public reset = new EventEmitter<Facilitator>()
  @Output()
  public saved = new EventEmitter<Facilitator>()

  @Input()
  public displayedColumns = [
    'name',
    'email',
    'organization',
    'role',
    'lastLogin',
    'actions',
  ]
  @Input()
  public dataSource: FacilitatorDataSource | null = null
  @Input()
  public filters: Array<Filter<Facilitator, any>> = []

  @ViewChild(MatPaginator)
  public paginator!: MatPaginator
  @ViewChild(MatSort)
  public sort!: MatSort

  public facilitatorDataProvider: DataProvider<FacilitatorService, Facilitator>
  public selectedId = ''
  public roles: FacilitatorRoleType[] = Facilitator.DEFAULT_ROLE_OPTIONS
  public displayedIcons: IconType[] = [
    'edit',
    'deleteAccount',
    'disable',
    'reset',
    'form',
    'refresh',
    'loginAs',
  ]
  public isLoading = false

  constructor(
    public dialog: MatDialog,
    public router: RouterService,
    public providerFactory: DataProviderFactory,
    public _fs: FacilitatorService,
    public _as: AuthService,
  ) {
    this.facilitatorDataProvider = providerFactory.getFacilitatorDataProvider()
  }

  public ngOnInit() {
    this.saved.subscribe(() => {
      this.selectedId = ''
    })
    // Init dataSource
    this.dataSource = new FacilitatorDataSource(
      this.facilitatorDataProvider,
      this.paginator,
      this.sort,
    )

    // Add filters if any have been added through `@Input('filters) public filter`.
    if (this.filters.length) {
      this.dataSource.addFilters(this.filters)
    }

    // Set default sorted column
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false })

    // Listen to refresh data event
    this._fs.reloadData$.subscribe(() => {
      this.facilitatorDataProvider.refresh()
    })

    // Let parent component know when data has been loaded
    this.facilitatorDataProvider.data.subscribe(d => {
      if (d.length > 0) {
        this.loadCompleted.emit()
      }
    })

    // Listen to data provider for further loading events
    this.facilitatorDataProvider.dataLoading.subscribe(
      loading => (this.isLoading = loading),
    )
  }

  public refresh() {
    try {
      this.facilitatorDataProvider.refresh()
    } catch (error) {
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN')
          this.router.navigateRoutes(['/403'])
        else this.router.navigateRoutes(['/login', '/admin'])
      } else {
        throw error
      }
    }
  }

  public onClickForm(facilitator: Facilitator) {
    const dialogRef = this.dialog.open(FacilitatorFormComponent, {
      data: {
        isDialog: true,
        facilitator,
      },
    })

    dialogRef.afterClosed().subscribe((f: Facilitator) => {
      if (f) {
        this.saved.emit(f)
      }
    })
  }

  public loginAs(facilitator: Facilitator) {
    this._as.loginAs(facilitator).subscribe(() => {
      this.router.navigateRoutes(['/dashboard'])
    })
  }
}
