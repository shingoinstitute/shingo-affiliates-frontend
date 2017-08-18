import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { WorkshopDataSource } from '../../services/workshop/workshop-data-source.service';
import { WorkshopDataProvider } from '../../services/workshop/workshop-data-provider.service';
import { WorkshopService, WorkshopProperties, WorkshopTrackByStrategy } from '../../services/workshop/workshop.service';
import { MdSort, MdPaginator } from '@angular/material';
import { Workshop, WorkshopStatusType } from '../Workshop';
import { Filter } from '../../services/filters/filter.abstract';

@Component({
  selector: 'app-workshop-data-table',
  templateUrl: './workshop-data-table.component.html',
  styleUrls: ['./workshop-data-table.component.scss']
})
export class WorkshopDataTableComponent implements OnInit {

  trackByStrategy: WorkshopTrackByStrategy = 'reference';

  @Input() displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'instructors', 'verified'];
  @Input() dataSource: WorkshopDataSource | null;
  @Input() filters: Filter[] = [];

  @ViewChild(MdSort) sort: MdSort;

  @ViewChild(MdPaginator) paginator: MdPaginator;


  constructor(public _workshopDataProvider: WorkshopDataProvider, private _ws: WorkshopService) { }

  ngOnInit() {
    if (!this.dataSource)
      this.dataSource = new WorkshopDataSource(this._workshopDataProvider, this.paginator, this.sort);
    else {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.filters) this.dataSource.addFilters(this.filters);

    this.sort.sort({ id: 'startDate', start: 'asc', disableClear: false });
  }

  workshopTrackBy = (index: number, item: Workshop) => {
    switch (this.trackByStrategy) {
      case 'id': return item.sfId;
      case 'reference': return item;
      case 'index': return index;
    }
  }

}
