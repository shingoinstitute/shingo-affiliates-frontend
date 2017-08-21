import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataProvider } from "../../services/data-provider.service";
import { AffiliateService } from "../../services/affiliate/affiliate.service";
import { Affiliate } from "../Affiliate";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { AffiliateDataSource } from "../../services/affiliate/affilaite-data-source.service";
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

  constructor(private providerFactory: DataProviderFactory) {
    this.affiliateDataProvider = providerFactory.getAffiliateDataProvider();
  }

  ngOnInit() {
    this.dataSource = new AffiliateDataSource(this.affiliateDataProvider, this.paginator, this.sort);

    this.sort.sort({ id: 'name', start: 'asc', disableClear: false });
  }

  onClickEdit(affiliate: Affiliate) {
    this.onClickEditEventEmitter.emit(affiliate);
  }

  onClickDelete(affiliate: Affiliate) {
    this.onClickDeleteEventEmitter.emit(affiliate);
  }

}
