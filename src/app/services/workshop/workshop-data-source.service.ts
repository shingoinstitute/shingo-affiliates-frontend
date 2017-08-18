// Angular Modules
import { Injectable } from '@angular/core';
import { MdPaginator, MdSort } from '@angular/material';
import { DataSource } from '@angular/cdk';

// App Modules
import { Workshop } from '../../workshops/Workshop';
import { WorkshopDataProvider } from './workshop-data-provider.service';
import { Filter } from '../filters/filter.abstract';

// RxJS Modules
import { Observable } from 'rxjs/Observable';

// RxJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class WorkshopDataSource extends DataSource<Workshop>{

  public get size(): number { return this._wdp.data.length; }

  constructor(
    private _wdp: WorkshopDataProvider,
    public paginator?: MdPaginator,
    public sort?: MdSort
  ) { super(); }

  public connect(): Observable<Workshop[]> {
    let changes = [this._wdp, this.paginator, this.sort, ...this._wdp.filters].filter(change => !!change);
    let dataChanges = changes.map(change => {
      if (change instanceof WorkshopDataProvider || change instanceof Filter) {
        return change.dataChange;
      } else if (change instanceof MdPaginator) {
        return change.page;
      } else if (change instanceof MdSort) {
        return change.mdSortChange;
      }
    });

    return Observable.merge(...dataChanges).map(() => {
      let data = this.getSortedData();

      if (this.size <= this.paginator.pageSize) this.paginator.pageIndex = 0;

      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  public addFilters(filters: Filter[]): void {
    for (const filter of filters) {
      this._wdp.addFilter(filter);
    }
  }

  public disconnect(): void { }

  private getSortedData(): Workshop[] {
    const data = this._wdp.data.slice();

    if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propA: number | string = '';
      let propB: number | string = '';

      switch (this.sort.active) {
        case 'actionType': [propA, propB] = [a.status, b.status]; break;
        case 'workshopType': [propA, propB] = [a.type, b.type]; break;
        case 'dueDate': [propA, propB] = [ a.dueDate.valueOf(), b.dueDate.valueOf()]; break;
        case 'instructors': [propA, propB] = [a.instructors && a.instructors.length ? a.instructors.length : -1, b.instructors && b.instructors.length ? b.instructors.length : -1]; break;
        case 'verified': [propA, propB] = [a.isVerified ? 1 : -1, b.isVerified ? 1 : -1]; break;
        case 'startDate': [propA, propB] = [a.startDate.valueOf(), b.startDate.valueOf()]; break;
        case 'endDate': [propA, propB] = [a.endDate.valueOf(), b.endDate.valueOf()]; break;
        case 'hostCity': [propA, propB] = [a.city, b.city]; break;
        case 'hostCountry': [propA, propB] = [a.country || '', b.country || '']; break;
        case 'location': [propA, propB] = [(a.city + (a.country || '')).split('/[\s,]/').join(''), (b.city + (b.country || '')).split('/[\s,]/').join('')]; break;
        case 'status': [propA, propB] = [a.status, b.status]; break;
      }

      let valueA = isNaN(+propA) ? propA : +propA;
      let valueB = isNaN(+propB) ? propB : +propB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
    });
  }

}
