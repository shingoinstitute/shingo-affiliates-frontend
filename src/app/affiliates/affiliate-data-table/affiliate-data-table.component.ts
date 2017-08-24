import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataProvider } from "../../services/data-provider.service";
import { AffiliateService } from "../../services/affiliate/affiliate.service";
import { Affiliate } from "../Affiliate";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { AffiliateDataSource } from "../../services/affiliate/affiliate-data-source.service";
import { MdPaginator, MdSort, MdDialog, MdDialogRef } from "@angular/material";
import { IconType } from "../../shared/components/icon-legend/icon-legend.component";
import { AffiliateFormComponent } from "../affiliate-form/affiliate-form.component";

@Component({
  selector: 'app-affiliate-data-table',
  templateUrl: './affiliate-data-table.component.html',
  styleUrls: ['./affiliate-data-table.component.scss']
})
export class AffiliateDataTableComponent {

  affiliateDataProvider: DataProvider<AffiliateService, Affiliate>;

  @ViewChild('paginator') paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  
  @Input() dataSource: AffiliateDataSource | null;
  @Input() displayedColumns = ["logo", "name", "website"];
  
  @Output('onClickSave') onClickSaveEventEmitter = new EventEmitter<Affiliate>();
  @Output('onClickDelete') onClickDeleteEventEmitter = new EventEmitter<Affiliate>();
  @Output('onClickForm') onClickFormEventEmitter = new EventEmitter<Affiliate>();
  @Output('onLoadComplete') onLoadCompleteEventEmitter = new EventEmitter<void>();
  
  // `selectedId` used to track which row is being edited.
  selectedId: string = '';
  
  displayedIcons: IconType[] = ['edit', 'delete', 'save', 'form'];

  trackByIndex(index, item) { return index; }

  constructor(public dialog: MdDialog, private providerFactory: DataProviderFactory, private _as: AffiliateService) {
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider();
  }

  ngOnInit() {
    this.onClickSaveEventEmitter.subscribe(() => { this.selectedId = ''; });
    // Init dataSource for data table
    this.dataSource = new AffiliateDataSource(this.affiliateDataProvider, this.paginator, this.sort);
    // Set 'name' as default sorted column
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false });
    // Listen to reload data event
    this._as.shouldReloadData$.subscribe(() => {
      console.log('refreshing data');
      this.affiliateDataProvider.refresh();
    });

    this.affiliateDataProvider.dataChange.subscribe(() => {
      if (this.affiliateDataProvider.data.length > 0) {
        this.onLoadCompleteEventEmitter.emit();
      }
    });
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

}
