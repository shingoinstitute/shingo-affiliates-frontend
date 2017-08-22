import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DataProvider } from "../../services/data-provider.service";
import { FacilitatorService } from "../../services/facilitator/facilitator.service";
import { Facilitator } from '../Facilitator';
import { MdDialog, MdPaginator, MdSort } from "@angular/material";
import { FacilitatorDataSource } from "../../services/facilitator/facilitator-data-source.service";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { IconType } from "../../shared/components/icon-legend/icon-legend.component";

@Component({
   selector: 'app-facilitator-data-table',
   templateUrl: './facilitator-data-table.component.html',
   styleUrls: ['./facilitator-data-table.component.scss']
})
export class FacilitatorDataTableComponent implements OnInit {

   facilitatorDataProvider: DataProvider<FacilitatorService, Facilitator>;
   selectedFacId: string = '';

   @Output('onLoadComplete') onLoadCompleteEvent = new EventEmitter<void>();
   @Output('onClickDelete') onClickDeleteEvent = new EventEmitter<Facilitator>();
   @Output('onClickDisable') onClickDisableEvent = new EventEmitter<Facilitator>();
   @Output('onClickReset') onClickRestEvent = new EventEmitter<Facilitator>();
   @Output('onClickSave') onClickSaveEvent = new EventEmitter<Facilitator>();

   @Input('displayedColumns') displayedColumns = ["name", "email", "organization", "actions"];
   @Input('dataSource') dataSource: FacilitatorDataSource | null;

   @ViewChild('paginator') paginator: MdPaginator;
   @ViewChild(MdSort) sort: MdSort;

   displayedIcons: IconType[] = ["edit", "delete", "disable", "reset"];

   constructor(public dialog: MdDialog, private providerFactory: DataProviderFactory) {
      this.facilitatorDataProvider = providerFactory.getFacilitatorDataProvider();
   }

   ngOnInit() {
      // Init dataSource
      this.dataSource = new FacilitatorDataSource(this.facilitatorDataProvider, this.paginator, this.sort);

      // Set default sorted column
      this.sort.sort({ id: 'name', start: 'asc', disableClear: false });

      // Let parent component know when data has been loaded
      this.facilitatorDataProvider.dataChange.subscribe(() => {
         if (this.facilitatorDataProvider.data.length > 0)
            this.onLoadCompleteEvent.emit();
      });
   }

   onClickSave(fac: Facilitator) {
      this.selectedFacId = '';
      this.onClickSaveEvent.emit(fac);
   }

}
