import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdPaginator, MdSort } from '@angular/material';


import { DataProvider } from '../../services/data-provider/data-provider.service';
import { FacilitatorService } from '../../services/facilitator/facilitator.service';
import { Facilitator, FacilitatorRoleType } from '../facilitator.model';
import { FacilitatorDataSource } from '../../services/facilitator/facilitator-data-source.service';
import { DataProviderFactory } from '../../services/data-provider/data-provider-factory.service';
import { IconType } from '../../shared/components/icon-legend/icon-legend.component';
import { FacilitatorFormComponent } from '../facilitator-form/facilitator-form.component';
import { RouterService } from '../../services/router/router.service';

@Component({
  selector: 'app-facilitator-data-table',
  templateUrl: './facilitator-data-table.component.html',
  styleUrls: ['./facilitator-data-table.component.scss']
})
export class FacilitatorDataTableComponent implements OnInit {

  @Output() public onLoadComplete = new EventEmitter<void>();
  @Output() public onDelete = new EventEmitter<Facilitator>();
  @Output() public onDisable = new EventEmitter<Facilitator>();
  @Output() public onReset = new EventEmitter<Facilitator>();
  @Output() public onSave = new EventEmitter<Facilitator>();

  @Input('displayedColumns') public displayedColumns = ['name', 'email', 'organization', 'role', 'lastLogin', 'actions'];
  @Input('dataSource') public dataSource: FacilitatorDataSource | null;

  @ViewChild(MdPaginator) public paginator: MdPaginator;
  @ViewChild(MdSort) public sort: MdSort;

  public facilitatorDataProvider: DataProvider<FacilitatorService, Facilitator>;
  public selectedId: string = '';
  public roles: FacilitatorRoleType[] = Facilitator.DEFAULT_ROLE_OPTIONS;
  public displayedIcons: IconType[] = ['edit', 'deleteAccount', 'disable', 'reset', 'form', 'refresh'];
  public isLoading: boolean;

  constructor(
    public dialog: MdDialog,
    public router: RouterService,
    public providerFactory: DataProviderFactory,
    public _fs: FacilitatorService
  ) {
    this.facilitatorDataProvider = providerFactory.getFacilitatorDataProvider();
  }

  public ngOnInit() {
    this.onSave.subscribe(() => { this.selectedId = ''; });
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
        this.onLoadComplete.emit();
      }
    });

    // Listen to data provider for further loading events
    this.facilitatorDataProvider.dataLoading.subscribe(loading => this.isLoading = loading);
  }

  public refresh() {
    try {
      this.facilitatorDataProvider.refresh();
    } catch (error) {
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN') this.router.navigateRoutes(['/403']);
        else this.router.navigateRoutes(['/login', '/admin']);
      } else
        throw error;
    }
  }

  public onClickForm(facilitator: Facilitator) {
    const dialogRef = this.dialog.open(FacilitatorFormComponent, {
      data: {
        isDialog: true,
        facilitator: facilitator
      }
    });

    dialogRef.afterClosed().subscribe((f: Facilitator) => {
      if (f)
        this.onSave.emit(f);
    });
  }

}
