import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { MatRadioButton, MatDatepicker, MatSort, MatPaginator, MatCheckboxChange, MatCheckbox, MatSelect, MatSelectChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { Filter } from '../../services/filters/filter.abstract';
import { User } from '../../shared/models/user.model';
import { WorkshopDataTableComponent } from '../../workshops/workshop-data-table/workshop-data-table.component';
import { WorkshopFilterFactory } from '../../services/filters/workshops/workshop-filter-factory.service';
import { WorkshopProperties, WorkshopService } from '../../services/workshop/workshop.service';
import { WorkshopStatusType } from '../../workshops/workshop.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { at } from 'lodash';

declare var $: any;

@Component({
  selector: 'app-workshop-dashboard',
  templateUrl: './workshop-dashboard.component.html',
  styleUrls: ['./workshop-dashboard.component.scss']
})
export class WorkshopDashboardComponent implements OnInit, AfterViewInit {

  public get showDateRange(): boolean { return this._showDateRange; }
  public get showFilters(): boolean { return this._showFilters; }
  public get showStatusFilter(): boolean { return this._showStatusFilter; }
  public get showTextFilter(): boolean { return this._showTextFilter; }

  @ViewChildren(MatCheckbox) public selectedFilters: MatCheckbox[];

  @ViewChild('startDateFilterPicker') public startDFPicker: MatDatepicker<Date>;
  @ViewChild('endDateFilterPicker') public endDFPicker: MatDatepicker<Date>;

  @ViewChild('startDFInput') public startDFInput: ElementRef;
  @ViewChild('endDFInput') public endDFInput: ElementRef;

  @ViewChild(MatSelect) public statusSelect: MatSelect;
  @ViewChild('textSearchInput') public textSearchInput: ElementRef;

  @ViewChild(WorkshopDataTableComponent) public workshopTable: WorkshopDataTableComponent;

  public _showDateRange: boolean = false;
  public _showFilters: boolean = false;
  public _showStatusFilter: boolean = false;
  public _showTextFilter: boolean = false;
  public dateRange: DateRange = [null, null];
  public deactivated: string[] = [];
  public displayedColumns: WorkshopProperties[] = ['workshopType', 'startDate', 'endDate', 'location', 'status', 'verified', 'actions'];
  public filterOption: string;
  public filterOptions: string[] = []; // the list of available filter options shown to the user
  public filters: Filter[]; // the list of filter objects used to do the actual filtering
  public selectedStatuses: any[] = [];
  public statuses: string[] = [];
  public textSearch: string = '';

  public get user(): User { return this.route.snapshot.data['user']; }

  constructor(public filterFactory: WorkshopFilterFactory, public _ws: WorkshopService, public router: Router, public route: ActivatedRoute, public authService: AuthService) {
    this.setStatuses();
  }

  public ngOnInit() {
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

  public ngAfterViewInit() {
    this.fillViewPortHeight();
    const observable: Observable<MatCheckboxChange>[] = this.selectedFilters.map(cbc => Observable.from(cbc.change));
    Observable.merge(...observable)
      .subscribe((event) => this.filter(event));
  }

  public initFilters() {
    this.filterOptions = ['by Upcoming Workshops'];
    this.filters = [this.filterFactory.createDateRangeFilter('by Upcoming Workshops') /* Upcoming */];

    if (this.user.isAdmin) {
      this.filterOptions.push('by Status');
      this.filters.push(this.filterFactory.createPropertyFilter('by Status')); // By Status (for admin)
    } else {
      this.filterOptions = this.filterOptions.concat(['by Action Pending', 'by Archived'
      ]);
      this.filters = this.filters.concat([
        this.filterFactory.createPropertyFilter('by Action Pending'),  // Action Pending Property
        this.filterFactory.createPropertyFilter('by Archived') // Archived Workshops
      ]);
    }
    this.filterOptions = this.filterOptions.concat(['by Text', 'by Date']);
    this.filters = this.filters.concat([
      this.filterFactory.createTextFilter('by Text'),      // Text Search
      this.filterFactory.createDateRangeFilter('by Date')  // Date range
    ]);
  }

  public goToWorkshopEdit(sfId: string) {
    this.router.navigateByUrl(`/workshops/${sfId}/edit`);
  }

  public selectedStatusChanged(event: MatSelectChange) {
    const index = this.filters.findIndex(f => f.name === 'by Status');
    this.filters[index].dataChange.next({ key: 'status', value: this.selectedStatuses });
  }

  public removeDeactivated(items: string[]) {
    for (const item of items) {
      const index = this.deactivated.findIndex(d => d === item);
      this.deactivated.splice(index, 1);
    }
  }

  /**
   * @desc Hack to get component to fill full height of view
   * @todo Put this into a directive named something like [fill-viewport]
   */
  public fillViewPortHeight() {
    const compView = $('.filter-options-container')[0];
    if (compView) {
      const toolbarHeight = window.innerWidth > 600 ? 64 : 56;
      $(compView).css('min-height', `${window.innerHeight - toolbarHeight}px`);
    }
  }

  public filter(cbc: MatCheckboxChange) {
    const value = cbc.source.value;
    let payload: { data: any, deactivate: number[] };
    const indices = {
      'by Upcoming Workshops': this.filters.findIndex(f => f.name === 'by Upcoming Workshops'),
      'by Action Pending': this.filters.findIndex(f => f.name === 'by Action Pending'),
      'by Archived': this.filters.findIndex(f => f.name === 'by Archived'),
      'by Status': this.filters.findIndex(f => f.name === 'by Status'),
      'by Text': this.filters.findIndex(f => f.name === 'by Text'),
      'by Date': this.filters.findIndex(f => f.name === 'by Date')
    };
    let deactivate = [];
    switch (value) {
      case 'by Upcoming Workshops': // upcoming
        deactivate = at(indices, ['by Action Pending', 'by Archived', 'by Date']);
        if (cbc.checked) payload = { data: [new Date().withoutTime(), null], deactivate };
        break;
      case 'by Action Pending': // actions pending
        deactivate = at(indices, ['by Upcoming Workshops', 'by Archived']);
        if (cbc.checked)
          payload = { data: { key: 'status', value: ['Action Pending', 'Invoiced, Not Paid', 'Finished, waiting for attendee list', 'Awaiting Invoice'] }, deactivate };
        break;
      case 'by Archived': // archived
        deactivate = at(indices, ['by Upcoming Workshops', 'by Action Pending']);
        if (cbc.checked) payload = { data: { key: 'status', value: 'Archived' }, deactivate };
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


    if (cbc.checked) this.applyFilter(indices[cbc.source.value], payload);
    else {
      this.removeDeactivated(at(this.filterOptions, deactivate));
      this.applyFilter(indices[cbc.source.value], { data: undefined, deactivate: [] });
    }
    this.deactivateFilters();
  }

  public applyFilter(index: number, { data, deactivate }) {
    this.filters[index].dataChange.next(data);
    this.deactivated = this.deactivated.concat(at(this.filterOptions, deactivate));
  }

  public deactivateFilters() {
    const values = new Set(this.deactivated);
    this.selectedFilters.map(cb => {
      if (values.has(cb.value)) cb.disabled = true;
      else cb.disabled = false;
    });
  }

  public clearFilters() {
    this.dateRange = [null, null];
    this.textSearch = '';
    this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
    this.startDFPicker._selected = this.endDFPicker._selected = null;
    this._showDateRange = this._showTextFilter = this._showStatusFilter = false;
    this.filters.map(f => f.dataChange.next(undefined));
    this.deactivated = [];
    this.selectedFilters.map(cb => cb.checked = false);
    this.selectedStatuses = [];
    this.deactivateFilters();
  }

  public clearDateFilter() {
    this.dateRange = [null, null];
    this.startDFInput.nativeElement.value = this.endDFInput.nativeElement.value = null;
    this.startDFPicker._selected = this.endDFPicker._selected = null;
    const index = this.filters.findIndex(f => f.name === 'by Date');
    this.filters[index].dataChange.next(undefined);
  }

  public toggleFilters() { this._showFilters = !this._showFilters; }

  public setStatuses() {
    this._ws.describe().subscribe(describe => this.getWorkshopStatuses(describe));
  }

  public getWorkshopStatuses(describe) {
    try {
      this.statuses = describe.status.picklistValues.map(option => option.label);
    } catch (e) {
      console.warn('Failed to get workshop statuses from `this.describe.status.picklistValues`. Using default values.', describe);
    }
  }

}
