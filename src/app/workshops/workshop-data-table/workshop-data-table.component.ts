import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { WorkshopDataSource } from '../../services/workshop/workshop-data-source.service';
import { DataProvider } from '../../services/data-provider/data-provider.service';
import { DataProviderFactory } from '../../services/data-provider/data-provider-factory.service';
import { WorkshopService, WorkshopProperties, WorkshopTrackByStrategy } from '../../services/workshop/workshop.service';
import { MdSort, MdPaginator, MdButton } from '@angular/material';
import { Workshop, WorkshopStatusType } from '../workshop.model';
import { Filter } from '../../services/filters/filter.abstract';

@Component({
  selector: 'app-workshop-data-table',
  templateUrl: './workshop-data-table.component.html',
  styleUrls: ['./workshop-data-table.component.scss']
})
export class WorkshopDataTableComponent implements OnInit {

  @Input() public displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'instructors', 'verified'];
  @Input() public dataSource: WorkshopDataSource | null;
  @Input() public filters: Filter[] = [];
  @Output() public editClick: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MdSort) public sort: MdSort;
  @ViewChild(MdPaginator) public paginator: MdPaginator;

  public isLoading: boolean = true;
  public _workshopDataProvider: DataProvider<WorkshopService, Workshop>;
  public trackByStrategy: WorkshopTrackByStrategy = 'reference';
  public pendingTypes = {
    'Active, not ready for app': 'Published to Website Only',
    'Cancelled': 'Cancelled',
    'Archived': 'Archived',
    'Active event': 'Published to Website & Mobile App',
    'Proposed': 'Proposed',
    'Finished, waiting for attendee list': 'Awaiting Attendee List/Evaluations',
    'Awaiting Invoice': 'Awaiting Invoice',
    'Verified': 'Verified',
    'Invoiced, Not Paid': 'Awaiting Payment'
  };

  constructor(public providerFactory: DataProviderFactory, public _ws: WorkshopService, public router: Router) {
    this._workshopDataProvider = providerFactory.getWorkshopDataProvider();
    this._workshopDataProvider.dataLoading.subscribe(loading => this.isLoading = loading);
  }

  public ngOnInit() {
    if (!this.dataSource)
      this.dataSource = new WorkshopDataSource(this._workshopDataProvider, this.paginator, this.sort);
    else {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (this.filters) this.dataSource.addFilters(this.filters);

    this.sort.sort({ id: 'startDate', start: 'asc', disableClear: false });
  }

  public refresh() { this._workshopDataProvider.refresh(); }

  public workshopTrackBy = (index: number, item: Workshop) => {
    switch (this.trackByStrategy) {
      case 'id': return item.sfId;
      case 'reference': return item;
      case 'index': return index;
    }
  }

  public onEdit(workshopId: string) { this.editClick.emit(workshopId); }

  /**
    * @description Returns true if a pending action is due, where
    * 'due' is defined as being 1 or more days after the workshop's
    * end date.
    *
    * Workshops that fall in this category but are not "past due"
    * are considered to be within their grace period.
    */
  public isDue(w: Workshop): boolean {
    const daysLate = this.getDaysLate(w);
    return daysLate > 0 && daysLate <= 7;
  }

  /**
   * @description Returns true if a pending action is past due,
   * where 'past due' is defined as being 7 or more days after
   * the workshop's end date.
   */
  public isPastDue(w: Workshop): boolean { return this.getDaysLate(w) > 7; }

  /**
   * @description Returns a string describing how far a pending
   * action is past it's due date.
   */
  public formatDaysLate(w: Workshop): string {
    const daysLate = this.getDaysLate(w);
    if (daysLate < 1)
      return `in ${Math.abs(daysLate)} days`;
    if (daysLate === 1)
      return `1 day ago`;
    if (daysLate < 30)
      return `${daysLate} days ago`;
    if (daysLate < 60)
      return `1 month ago`;
    if (daysLate < 365)
      return `${Math.floor(daysLate / 30)} months ago`;
    if (daysLate < 365 + 30)
      return `1 year ago`;
    if (daysLate < 365 * 2)
      return `1 year ${Math.floor((daysLate - 365) / 30)} months ago`;
    return `${Math.floor(daysLate / 365)} years ago`;
  }

  /**
   * @description Returns the number of days a pending action
   * is past it's due date.
   */
  public getDaysLate(w: Workshop): number {
    const _1day = 1000 * 60 * 60 * 24;
    const now = Date.now();
    const dueAt = new Date(w.endDate).valueOf() + _1day * 7;
    return Math.floor((now - dueAt) / _1day);
  }

  public onSelectRow(workshop) {
    this.router.navigateByUrl(`/workshops/${workshop.sfId}`);
  }

}
