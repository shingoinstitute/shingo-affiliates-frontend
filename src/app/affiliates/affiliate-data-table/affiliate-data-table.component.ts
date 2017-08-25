/* tslint:disable */
import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataProvider } from "../../services/data-provider.service";
import { AffiliateService } from "../../services/affiliate/affiliate.service";
import { Affiliate } from "../Affiliate";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { AffiliateDataSource } from "../../services/affiliate/affiliate-data-source.service";
import { MdPaginator, MdSort, MdDialog, MdDialogRef } from "@angular/material";
import { IconType } from "../../shared/components/icon-legend/icon-legend.component";
import { AffiliateFormComponent } from "../affiliate-form/affiliate-form.component";

import { Filter } from '../../services/filters/filter.abstract';
import { RouterService } from '../../services/router/router.service';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-affiliate-data-table',
  templateUrl: './affiliate-data-table.component.html',
  styleUrls: ['./affiliate-data-table.component.scss']
})
export class AffiliateDataTableComponent {

  private isLoading: boolean = true;

  affiliateDataProvider: DataProvider<AffiliateService, Affiliate>;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  @Input() dataSource: AffiliateDataSource | null;
  @Input() displayedColumns = ["logo", "name", "website"];
  @Input() filters: Filter[] = [];

  @Output('onClickSave') onClickSaveEventEmitter = new EventEmitter<Affiliate>();
  @Output('onClickDelete') onClickDeleteEventEmitter = new EventEmitter<Affiliate>();
  @Output('onClickForm') onClickFormEventEmitter = new EventEmitter<Affiliate>();

  // `selectedId` used to track which row is being edited.
  selectedId: string = '';

  displayedIcons: IconType[] = ['edit', 'delete', 'save', 'form'];

  trackByIndex(index, item) {
    return item.sfId;
  }

  constructor(public dialog: MdDialog, private providerFactory: DataProviderFactory, private _as: AffiliateService, private router: RouterService) {
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider();
    this.affiliateDataProvider.dataLoading.subscribe(loading => this.isLoading = loading);
  }

  ngOnInit() {
    this.onClickSaveEventEmitter.subscribe(() => { this.selectedId = ''; });
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

  onClickDelete(affiliate: Affiliate) {
    this.onClickDeleteEventEmitter.emit(affiliate);
  }

  /**
   * @deprecated keeping this function around just in case, but we're most 
   * likely moving away from using dialogs to open edit-detail-forms completely.
   */
  openFormDialog(affiliate: Affiliate) {
    // determine height and width value of dialog
    const height = window.innerWidth < 960 ? '100vh' : '90vh';
    const width = window.innerWidth < 960 ? String(window.innerWidth) : null;

    let dialogRef = this.dialog.open(AffiliateFormComponent, {
      data: {
        isDialog: true,
        affiliate: affiliate
      },
      height: height,
      width: width
    });

    dialogRef.afterClosed().subscribe(affiliate => {
      console.log(affiliate);
      if (affiliate) {
        this.onClickSaveEventEmitter.emit(affiliate);
      }
    });
  }

  refresh() {
    try {
      this.affiliateDataProvider.refresh();
    } catch (error) {
      console.log('caught http error in UserResolver', error);
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN') this.router.navigateRoutes(['/403']);
        else this.router.navigateRoutes(['/login', '/admin']);
      }
      else throw error;
    }
  }

}
