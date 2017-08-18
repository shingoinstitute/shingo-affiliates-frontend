import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MdRadioButton, MdDatepicker, MdSort, MdPaginator } from '@angular/material';
import { Router } from '@angular/router';

import { WorkshopDataSource } from '../../services/workshop/workshop-data-source.service';
import { WorkshopDataProvider } from '../../services/workshop/workshop-data-provider.service';
import { Filter } from '../../services/filters/filter.abstract';
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service';
import { WorkshopStatusType } from '../../workshops/Workshop';
import { WorkshopProperties } from '../../services/workshop/workshop.service';
import { WorkshopDataTableComponent } from '../../workshops/workshop-data-table/workshop-data-table.component';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';

@Component({
      selector: 'app-workshop-dashboard',
      templateUrl: './workshop-dashboard.component.html',
      styleUrls: ['./workshop-dashboard.component.scss']
})
export class WorkshopDashboardComponent implements OnInit, AfterViewInit {

      private _showFilters: boolean = false;
      private _showTextFilter: boolean = false;
      private _showDateRange: boolean = false;
      private filters: Filter[];
      private dataSource: WorkshopDataSource;
      private displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'status', 'verified', 'edit'];
      private dateRange: DateRange = [null, null];

      private filterOptions: string[] = [
            "No Filter",
            "by Upcoming Workshops",
            "by Actions Pending",
            "by Archived Workshops",
            "by Text",
            "by Date"
      ];

      private filterOption: string = this.filterOptions[0];
      private textSearch: string = '';

      private get showFilters(): boolean { return this._showFilters; }
      private get showTextFilter(): boolean { return this._showTextFilter; }
      private get showDateRange(): boolean { return this._showDateRange; }

      @ViewChild('startDateFilterPicker') startDFPicker: MdDatepicker<Date>;
      @ViewChild('endDateFilterPicker') endDFPicker: MdDatepicker<Date>;
      @ViewChild('startDFInput') startDFInput: ElementRef;
      @ViewChild('endDFInput') endDFInput: ElementRef;
      @ViewChild('textSearchInput') textSearchInput: ElementRef;
      @ViewChild(WorkshopDataTableComponent) workshopTable: WorkshopDataTableComponent;

      constructor(private _wsDp: WorkshopDataProvider, private filterFactory: WorkshopFilterFactory, private router : Router) {
            this.filters = [
                  filterFactory.createDataRangeFilter(), // Date Range
                  filterFactory.createPropertyFilter(),  // Action Pending Property
                  filterFactory.createPropertyFilter(),  // Archived Workshops
                  filterFactory.createTextFilter()       // Text Search
            ];
            this.dataSource = new WorkshopDataSource(_wsDp, new MdPaginator(null), new MdSort);
            this.dataSource.addFilters(this.filters);
      }

      goToWorkshopEdit(sfId: string) {
            console.log('go to ', sfId);
            this.router.navigateByUrl(`/workshops/${sfId}/edit`)
      }

      ngOnInit() {
            this.startDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[0] = date;
                  this.filters[0].dataChange.next(this.dateRange);
            });

            this.endDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[1] = date;
                  this.filters[0].dataChange.next(this.dateRange);
            });

            Observable.fromEvent(this.textSearchInput.nativeElement, 'keyup')
            .debounceTime(150)
            .subscribe((event) => {
                  this.filters[3].dataChange.next(this.textSearch);
            })

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
            this.filters[3].dataChange.next(undefined);
            this._showTextFilter = this._showDateRange = false;
            switch (value) {
                  case this.filterOptions[1]: // upcoming
                        this.filters[0].dataChange.next([new Date(), null]);
                        break;
                  case this.filterOptions[2]: // actions pending
                        this.filters[1].dataChange.next({ key: 'status', value: ['Action Pending', 'Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice'] });
                        break;
                  case this.filterOptions[3]: // archived
                        this.filters[2].dataChange.next({ key: 'status', value: 'Archived' });
                        break;
                  case this.filterOptions[4]: // text
                        this._showTextFilter = true;
                        break;
                  case this.filterOptions[5]: // date range
                        this._showDateRange = true;
            }
      }

      private clearDateFilter() {
            this.dateRange = [null, null];
            this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
            this.startDFPicker._selected = this.endDFPicker._selected = null;
            this.filters[0].dataChange.next(undefined);
      }

      private toggleFilters() { this._showFilters = !this._showFilters; }

}
