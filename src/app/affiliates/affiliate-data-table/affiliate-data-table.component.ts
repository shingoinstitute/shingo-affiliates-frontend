import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core'
import { MatPaginator, MatSort } from '@angular/material'

import { DataProvider } from '../../services/data-provider/data-provider.service'
import { AffiliateService } from '../../services/affiliate/affiliate.service'
import { Affiliate } from '../affiliate.model'
import { DataProviderFactory } from '../../services/data-provider/data-provider-factory.service'
import { AffiliateDataSource } from '../../services/affiliate/affiliate-data-source.service'
import { IconType } from '../../shared/components/icon-legend/icon-legend.component'
import { Filter } from '../../services/filters/filter.abstract'
import { RouterService } from '../../services/router/router.service'

@Component({
  selector: 'app-affiliate-data-table',
  templateUrl: './affiliate-data-table.component.html',
  styleUrls: ['./affiliate-data-table.component.scss'],
})
export class AffiliateDataTableComponent implements OnInit {
  @Input()
  public dataSource: AffiliateDataSource | null = null
  @Input()
  public displayedColumns: string[] = ['logo', 'name', 'website']
  @Input()
  public filters: Array<Filter<Affiliate, any>> = []

  @Output()
  public saved = new EventEmitter<Affiliate>()
  @Output()
  public deleted = new EventEmitter<Affiliate>()
  @Output()
  public formed = new EventEmitter<Affiliate>()

  @ViewChild(MatPaginator)
  public paginator!: MatPaginator
  @ViewChild(MatSort)
  public sort!: MatSort

  public affiliateDataProvider: DataProvider<AffiliateService, Affiliate>
  public isLoading = true
  public selectedId = ''
  public displayedIcons: IconType[] = [
    'edit',
    'delete',
    'save',
    'form',
    'refresh',
  ]

  constructor(
    public providerFactory: DataProviderFactory,
    public _as: AffiliateService,
    public router: RouterService,
  ) {
    // getAffiliateDataProvider reroutes if any error occurs in method
    // therefore the returned undefined value should never be used, but it is necessary because of the try catch statement
    // tslint:disable-next-line:no-non-null-assertion
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider()!
    this.affiliateDataProvider.dataLoading.subscribe(
      loading => (this.isLoading = loading),
    )
  }

  public ngOnInit() {
    this.saved.subscribe(() => {
      this.selectedId = ''
    })
    // Init dataSource for data table
    if (!this.dataSource) {
      this.dataSource = new AffiliateDataSource(
        this.affiliateDataProvider,
        this.paginator,
        this.sort,
      )
    } else {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }

    if (this.filters) this.dataSource.addFilters(this.filters)

    // Set 'name' as default sorted column
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false })
  }

  public refresh() {
    try {
      this.affiliateDataProvider.refresh()
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

  public trackByIndex(_index: number, item: any) {
    return item.sfId
  }

  public delete(affiliate: Affiliate) {
    this.deleted.emit(affiliate)
  }
}
