import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataProvider } from "../../services/data-provider.service";
import { AffiliateService } from "../../services/affiliate/affiliate.service";
import { Affiliate } from "../Affiliate";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { AffiliateDataSource } from "../../services/affiliate/affiliate-data-source.service";
import { MdPaginator, MdSort } from "@angular/material";

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

  @Output('onClickEdit') onClickEditEventEmitter = new EventEmitter<Affiliate>();
  @Output('onClickDelete') onClickDeleteEventEmitter = new EventEmitter<Affiliate>();
  @Output('onLoadComplete') onLoadCompleteEventEmitter = new EventEmitter<void>();

  constructor(private providerFactory: DataProviderFactory, private _as: AffiliateService) {
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider();
  }

  ngOnInit() {
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
      if (this.affiliateDataProvider.data.length > 0)
        this.onLoadCompleteEventEmitter.emit();
    });
  }

  onClickEdit(affiliate: Affiliate) {
    this.onClickEditEventEmitter.emit(affiliate);
  }

  onClickDelete(affiliate: Affiliate) {
    this.onClickDeleteEventEmitter.emit(affiliate);
  }

}
