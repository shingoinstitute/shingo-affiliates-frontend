import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { MdRadioButton, MdDatepicker, MdSort, MdPaginator, MdCheckboxChange, MdCheckbox, MdSelect, MdSelectChange } from '@angular/material';
import { Router } from '@angular/router';

import { Filter } from '../../services/filters/filter.abstract';
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service';
import { WorkshopStatusType } from '../../workshops/Workshop';
import { WorkshopProperties, WorkshopService } from '../../services/workshop/workshop.service';
import { WorkshopDataTableComponent } from '../../workshops/workshop-data-table/workshop-data-table.component';
import { AuthService } from '../../services/auth/auth.service';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';

import { at } from 'lodash';

@Component({
      selector: 'app-workshop-dashboard',
      templateUrl: './workshop-dashboard.component.html',
      styleUrls: ['./workshop-dashboard.component.scss']
})
export class WorkshopDashboardComponent implements OnInit, AfterViewInit {

      private deactivated: string[] = [];
      private _showStatusFilter: boolean = false;
      private _showFilters: boolean = false;
      private _showTextFilter: boolean = false;
      private _showDateRange: boolean = false;
      private selectedStatuses: any[] = [];
      private statuses: string[] = [];
      private filters: Filter[];
      private displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'status', 'verified', 'edit'];
      private dateRange: DateRange = [null, null];

      private filterOptions: string[] = [];

      private filterOption: string = this.filterOptions[0];
      private textSearch: string = '';

      public get showFilters(): boolean { return this._showFilters; }
      public get showTextFilter(): boolean { return this._showTextFilter; }
      public get showDateRange(): boolean { return this._showDateRange; }
      public get showStatusFilter(): boolean { return this._showStatusFilter; }

      @ViewChild('startDateFilterPicker') startDFPicker: MdDatepicker<Date>;
      @ViewChild('endDateFilterPicker') endDFPicker: MdDatepicker<Date>;
      @ViewChild('startDFInput') startDFInput: ElementRef;
      @ViewChild('endDFInput') endDFInput: ElementRef;
      @ViewChild('textSearchInput') textSearchInput: ElementRef;
      @ViewChild(MdSelect) statusSelect: MdSelect;
      @ViewChildren(MdCheckbox) checkboxen: MdCheckbox[];
      @ViewChild(WorkshopDataTableComponent) workshopTable: WorkshopDataTableComponent;

      constructor(private filterFactory: WorkshopFilterFactory, private router: Router, private auth: AuthService, private _ws: WorkshopService) {
            this.setStatuses();
      }

      goToWorkshopEdit(sfId: string) {
            this.router.navigateByUrl(`/workshops/${sfId}/edit`)
      }

      ngOnInit() {
            this.initFilters();
            const drIndex = this.filters.findIndex(f => f.name === 'by Date');
            this.startDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[0] = date;
                  this.filters[drIndex].dataChange.next(this.dateRange);
            });

            this.endDFPicker.selectedChanged.subscribe((date: Date) => {
                  this.dateRange[1] = date;
                  this.filters[drIndex].dataChange.next(this.dateRange);
            });

            const textIndex = this.filters.findIndex(f => f.name === 'by Text');
            Observable.fromEvent(this.textSearchInput.nativeElement, 'keyup')
                  .debounceTime(150)
                  .subscribe((event) => {
                        this.filters[textIndex].dataChange.next(this.textSearch);
                  });
      }

      initFilters() {
            this.filterOptions = ["by Upcoming Workshops"];
            this.filters = [this.filterFactory.createDateRangeFilter("by Upcoming Workshops") /* Upcoming */];
            const isAdmin: boolean = this.auth.user && this.auth.user.isAdmin;
            if (isAdmin) {
                  this.filterOptions.push("by Status")
                  this.filters.push(this.filterFactory.createPropertyFilter('by Status')); // By Status (for admin)
            } else {
                  this.filterOptions = this.filterOptions.concat(["by Action Pending", "by Archived"
                  ]);
                  this.filters = this.filters.concat([
                        this.filterFactory.createPropertyFilter("by Action Pending"),  // Action Pending Property
                        this.filterFactory.createPropertyFilter("by Archived"), // Archived Workshops
                  ]);
            }
            this.filterOptions = this.filterOptions.concat(["by Text", "by Date"]);
            this.filters = this.filters.concat([
                  this.filterFactory.createTextFilter("by Text"),      // Text Search
                  this.filterFactory.createDateRangeFilter("by Date")  // Date range
            ]);
      }

      ngAfterViewInit() {
            this.fillViewPortHeight();
            const observable: Observable<MdCheckboxChange>[] = this.checkboxen.map(cbc => Observable.from(cbc.change));
            Observable.merge(...observable)
                  .subscribe((event) => this.applyFilter(event));
      }

      private selectedStatusChanged(event: MdSelectChange) {
            const index = this.filters.findIndex(f => f.name === 'by Status');
            this.filters[index].dataChange.next({ key: 'status', value: this.selectedStatuses });
      }

      private removeDeactivated(items: string[]) {
            for (const item of items) {
                  const index = this.deactivated.findIndex(d => d === item);
                  this.deactivated.splice(index, 1);
            }
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

      private applyFilter(cbc: MdCheckboxChange) {
            const value = cbc.source.value;
            let payload: { data: any, deactivate: number[] };
            const indices = {
                  'by Upcoming Workshops': this.filters.findIndex(f => f.name === 'by Upcoming Workshops'),
                  'by Action Pending': this.filters.findIndex(f => f.name === 'by Action Pending'),
                  'by Archived': this.filters.findIndex(f => f.name === 'by Archived'),
                  'by Status': this.filters.findIndex(f => f.name === 'by Status'),
                  'by Text': this.filters.findIndex(f => f.name === 'by Text'),
                  'by Date': this.filters.findIndex(f => f.name === 'by Date')
            }
            let deactivate = [];
            switch (value) {
                  case 'by Upcoming Workshops': // upcoming
                        deactivate = at(indices, ['by Action Pending', 'by Archived', 'by Date']);
                        if (cbc.checked) payload = { data: [new Date().withoutTime(), null], deactivate };
                        break;
                  case 'by Action Pending': // actions pending
                        deactivate = at(indices, ['by Upcoming Workshops', 'by Archived']);
                        if (cbc.checked) payload = { data: { key: 'status', value: ['Action Pending', 'Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice'] }, deactivate }
                        break;
                  case 'by Archived': // archived
                        deactivate = at(indices, ['by Upcoming Workshops', 'by Action Pending']);
                        if (cbc.checked) payload = { data: { key: 'status', value: 'Archived' }, deactivate }
                        break;
                  case 'by Status': // status
                        this._showStatusFilter = cbc.checked;
                        if (cbc.checked) payload = { data: { key: 'status', value: this.selectedStatuses }, deactivate };
                        break;
                  case 'by Text': // text
                        this._showTextFilter = cbc.checked;
                        if (cbc.checked) payload = { data: this.textSearch, deactivate };
                        break;
                  case 'by Date': // date range
                        deactivate = at(indices, ['by Upcoming Workshops']);
                        this._showDateRange = cbc.checked;
                        if (cbc.checked) payload = { data: this.dateRange, deactivate };
            }


            if (cbc.checked) this._applyFilter(indices[cbc.source.value], payload);
            else {
                  this.removeDeactivated(at(this.filterOptions, deactivate));
                  this._applyFilter(indices[cbc.source.value], { data: undefined, deactivate: [] });
            }
            this.deactivateCheckboxes();
      }

      private _applyFilter(index: number, { data, deactivate }) {
            this.filters[index].dataChange.next(data);
            this.deactivated = this.deactivated.concat(at(this.filterOptions, deactivate));
      }

      private deactivateCheckboxes() {
            const values = new Set(this.deactivated);
            this.checkboxen.map(cb => {
                  if (values.has(cb.value)) cb.disabled = true;
                  else cb.disabled = false;
            });
      }

      private clearFilters() {
            this.dateRange = [null, null];
            this.textSearch = '';
            this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
            this.startDFPicker._selected = this.endDFPicker._selected = null;
            this._showDateRange = this._showTextFilter = false;
            this.filters.map(f => f.dataChange.next(undefined));
            this.deactivated = [];
            this.checkboxen.map(cb => cb.checked = false);
            this.selectedStatuses = [];
            this.deactivateCheckboxes();
      }

      private clearDateFilter() {
            this.dateRange = [null, null];
            this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
            this.startDFPicker._selected = this.endDFPicker._selected = null;
            const index = this.filters.findIndex(f => f.name === 'by Date');
            this.filters[index].dataChange.next(undefined);
      }

      private toggleFilters() { this._showFilters = !this._showFilters; }

      private setStatuses() {
            this._ws.describe().subscribe(describe => this.getWorkshopStatuses(describe));
      }

      private getWorkshopStatuses(describe) {
            try {
                  this.statuses = describe.status.picklistValues.map(option => option.label);
            } catch (e) {
                  console.warn('Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.', describe);

            }
      }

}