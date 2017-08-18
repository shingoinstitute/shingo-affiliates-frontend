import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdRadioButton, MdDatepicker, MdSort, MdPaginator } from '@angular/material';

import { WorkshopDataSource } from '../../services/workshop/workshop-data-source.service';
import { WorkshopDataProvider } from '../../services/workshop/workshop-data-provider.service';
import { Filter } from '../../services/filters/filter.abstract';
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service';
import { WorkshopStatusType } from '../../workshops/Workshop';
import { WorkshopProperties } from '../../services/workshop/workshop.service';
import { WorkshopDataTableComponent } from '../../workshops/workshop-data-table/workshop-data-table.component';

import { Observable } from "rxjs/Observable";

@Component({
      selector: 'app-workshop-dashboard',
      templateUrl: './workshop-dashboard.component.html',
      styleUrls: ['./workshop-dashboard.component.scss']
})
export class WorkshopDashboardComponent {

      private filters: Filter[];
      private dataSource: WorkshopDataSource;
      private displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'status', 'verified'];
      private dateRange: DateRange = [null, null];

      private filterOptions: string[] = [
            "Show All",
            "Show Upcoming Workshops",
            "Show Actions Pending",
            "Show Archived Workshops"
      ];

      private filterOption: string = this.filterOptions[0];

      @ViewChild('startDateFilterPicker') startDFPicker: MdDatepicker<Date>;
      @ViewChild('endDateFilterPicker') endDFPicker: MdDatepicker<Date>;
      @ViewChild('startDFInput') startDFInput: ElementRef;
      @ViewChild('endDFInput') endDFInput: ElementRef;
      @ViewChild(WorkshopDataTableComponent) workshopTable: WorkshopDataTableComponent;

      constructor(private _wsDp: WorkshopDataProvider, private filterFactory: WorkshopFilterFactory) {
            this.filters = [
                  filterFactory.createDataRangeFilter(),
                  filterFactory.createPropertyFilter(), // Action Pending Property
                  filterFactory.createPropertyFilter()  // Archived Workshops
            ];
            this.dataSource = new WorkshopDataSource(_wsDp, new MdPaginator(null), new MdSort);
            this.dataSource.addFilters(this.filters);
            console.log('built dataSource', this.dataSource)
      }

      ngOnInit() {
            this.startDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[0] = date;
            });

            this.endDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[1] = date;
            });
      }

      ngAfterViewInit() {
            this.fillViewPortHeight();
      }

      /**
       * @desc Hack to get component to fill full height of view
       * @todo Put this into a directive named something like [fill-viewport]
       */
      private fillViewPortHeight() {
            const compView = $('.filter-options-container')[0];
            if (compView) {
                  const toolbarHeight = window.innerWidth > 600 ? 64 : 56;
                  $(compView).css('min-height', `${window.innerHeight - toolbarHeight}px`);
            }
      }

      private applyFilter(rb: MdRadioButton) {
            const value = rb.value;

            this.filters[0].dataChange.next(undefined);
            this.filters[1].dataChange.next(undefined);
            this.filters[2].dataChange.next(undefined);
            switch (value) {
                  case this.filterOptions[1]: // upcoming
                        this.filters[0].dataChange.next([new Date(), null]);
                        break;
                  case this.filterOptions[2]: // actions pending
                        this.filters[1].dataChange.next({ key: 'status', value: ['Action Pending', 'Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice'] });
                        break;
                  case this.filterOptions[3]: // archived
                        this.filters[2].dataChange.next({ key: 'status', value: 'Archived' });
            }
      }

      private clearDateFilter() {
            this.filterOption = this.filterOptions[0];
            this.dateRange = [null, null];
            this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
            this.startDFPicker._selected = this.endDFPicker._selected = null;
            this.filters[0].dataChange.next(undefined);
      }

      private filterByDate() {
            this.filters[0].dataChange.next(this.dateRange);
            if (this.dateRange[0])
                  this.filterOption = null;
      }

}
