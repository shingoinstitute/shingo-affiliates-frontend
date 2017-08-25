import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DataProvider } from '../../services/data-provider.service';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';
import { Facilitator } from '../Facilitator';
import { MdDialog, MdPaginator, MdSort } from "@angular/material";
import { FacilitatorDataSource } from "../../services/facilitator/facilitator-data-source.service";
import { DataProviderFactory } from "../../services/data-provider-factory.service";
import { IconType } from "../../shared/components/icon-legend/icon-legend.component";
import { FacilitatorFormComponent } from "../facilitators.module";

@Component({
      selector: 'app-facilitator-data-table',
      templateUrl: './facilitator-data-table.component.html',
      styleUrls: ['./facilitator-data-table.component.scss']
})
export class FacilitatorDataTableComponent implements OnInit {

   facilitatorDataProvider: DataProvider<FacilitatorService, Facilitator>;
   selectedId: string = '';
   roles = Facilitator.DEFAULT_ROLE_OPTIONS;

   @Output('onLoadComplete') onLoadCompleteEvent = new EventEmitter<void>();
   @Output('onClickDelete') onClickDeleteEvent = new EventEmitter<Facilitator>();
   @Output('onClickDisable') onClickDisableEvent = new EventEmitter<Facilitator>();
   @Output('onClickReset') onClickResetEvent = new EventEmitter<Facilitator>();
   @Output('onClickSave') onClickSaveEvent = new EventEmitter<Facilitator>();

      @Input('displayedColumns') displayedColumns = ['name', 'email', 'organization', 'role', 'actions'];
      @Input('dataSource') dataSource: FacilitatorDataSource | null;

      @ViewChild('paginator') paginator: MdPaginator;
      @ViewChild(MdSort) sort: MdSort;

   displayedIcons: IconType[] = ["edit", "deleteAccount", "disable", "reset", "form"];

   constructor(public dialog: MdDialog, private providerFactory: DataProviderFactory, private _fs: FacilitatorService) {
      this.facilitatorDataProvider = providerFactory.getFacilitatorDataProvider();
   }

  ngOnInit() {
    this.onClickSaveEvent.subscribe(() => { this.selectedId = ''; });
      // Init dataSource
      this.dataSource = new FacilitatorDataSource(this.facilitatorDataProvider, this.paginator, this.sort);

      // Set default sorted column
      this.sort.sort({ id: 'name', start: 'asc', disableClear: false });

      // Listen to refresh data event
      this._fs.reloadData$.subscribe(() => {
        this.facilitatorDataProvider.refresh();
      });

      // Let parent component know when data has been loaded
      this.facilitatorDataProvider.dataChange.subscribe(() => {
         if (this.facilitatorDataProvider.data.length > 0) {
          this.onLoadCompleteEvent.emit();
         }
      });
   }

  onClickForm(facilitator: Facilitator) {
    let dialogRef = this.dialog.open(FacilitatorFormComponent, {
      data: {
        isDialog: true,
        facilitator: facilitator
      }
    });

    dialogRef.afterClosed().subscribe(facilitator => {
      if (facilitator) {
        this.onClickSaveEvent.emit(facilitator);
      }
    });
  }

}
