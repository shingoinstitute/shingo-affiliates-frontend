import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MdPaginator, MdSort, MdDialog, MdDialogRef } from '@angular/material';

import { DataProvider } from '../../services/data-provider.service';
import { AffiliateService } from '../../services/affiliate/affiliate.service';
import { Affiliate } from '../Affiliate';
import { DataProviderFactory } from '../../services/data-provider-factory.service';
import { AffiliateDataSource } from '../../services/affiliate/affiliate-data-source.service';
import { IconType } from '../../shared/components/icon-legend/icon-legend.component';
import { AffiliateFormComponent } from '../affiliate-form/affiliate-form.component';
import { Filter } from '../../services/filters/filter.abstract';
import { RouterService } from '../../services/router/router.service';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-affiliate-data-table',
  templateUrl: './affiliate-data-table.component.html',
  styleUrls: ['./affiliate-data-table.component.scss']
})
export class AffiliateDataTableComponent implements OnInit {

  @Input() public dataSource: AffiliateDataSource | null;
  @Input() public displayedColumns: string[] = ['logo', 'name', 'website'];
  @Input() public filters: Filter[] = [];

  @Output() public onSave = new EventEmitter<Affiliate>();
  @Output() public onDelete = new EventEmitter<Affiliate>();
  @Output() public onForm = new EventEmitter<Affiliate>();

  @ViewChild(MdPaginator) private paginator: MdPaginator;
  @ViewChild(MdSort) private sort: MdSort;

  private affiliateDataProvider: DataProvider<AffiliateService, Affiliate>;
  private isLoading: boolean = true;
  private selectedId: string = '';
  private displayedIcons: IconType[] = ['edit', 'delete', 'save', 'form'];


  constructor(public dialog: MdDialog, private providerFactory: DataProviderFactory, private _as: AffiliateService, private router: RouterService) {
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider();
    this.affiliateDataProvider.dataLoading.subscribe(loading => this.isLoading = loading);
  }

  public ngOnInit() {
    this.onSave.subscribe(() => { this.selectedId = ''; });
    // Init dataSource for data table
    if (!this.dataSource) {
      this.dataSource = new AffiliateDataSource(this.affiliateDataProvider, this.paginator, this.sort);
    } else {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.filters) this.dataSource.addFilters(this.filters);

    // Set 'name' as default sorted column
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false });
  }

  public refresh() {
    try {
      this.affiliateDataProvider.refresh();
    } catch (error) {
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN') this.router.navigateRoutes(['/403']);
        else this.router.navigateRoutes(['/login', '/admin']);
      } else
        throw error;
    }
  }

  private trackByIndex(index, item) { return item.sfId; }

  private delete(affiliate: Affiliate) { this.onDelete.emit(affiliate); }

  /**
   * @deprecated keeping this function around just in case, but we're most 
   * likely moving away from using dialogs to open edit-detail-forms completely.
   */
  private openFormDialog(affiliate: Affiliate) {
    // determine height and width value of dialog
    const height = window.innerWidth < 960 ? '100vh' : '90vh';
    const width = window.innerWidth < 960 ? String(window.innerWidth) : null;

    const dialogRef = this.dialog.open(AffiliateFormComponent, {
      data: {
        isDialog: true,
        affiliate: affiliate
      },
      height: height,
      width: width
    });

    dialogRef.afterClosed().subscribe(af => {
      if (af) {
        this.onSave.emit(af);
      }
    });
  }

}
