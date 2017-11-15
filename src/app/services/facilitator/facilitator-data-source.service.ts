// Angular Modules
import { MatPaginator, MatSort } from '@angular/material';

// App Modules
import { FacilitatorService } from './facilitator.service';
import { DataProvider } from '../data-provider/data-provider.service';
import { APIDataSource } from '../api/api-data-source.abstract.service';
import { Facilitator } from '../../facilitators/facilitator.model';


export class FacilitatorDataSource extends APIDataSource<FacilitatorService, Facilitator> {

  constructor(
    public _fdp: DataProvider<FacilitatorService, Facilitator>,
    public paginator?: MatPaginator,
    public sort?: MatSort
  ) { super(_fdp, paginator, sort); }

  protected getSortedData(): Facilitator[] {
    const data = this._fdp.data.slice();

    if (!this.sort.active || this.sort.direction === '') { return data; }

    return data.sort((a: Facilitator, b: Facilitator) => {
      let propA: number | string = '';
      let propB: number | string = '';

      console.log('SORT BY: ' + this.sort.active);

      switch (this.sort.active) {
        case 'name': [propA, propB] = [a.lastName, b.lastName]; break;
        case 'email': [propA, propB] = [a.email, b.email]; break;
        case 'role': [propA, propB] = [<string>a.role, <string>b.role]; break;
        case 'lastLogin': [propA, propB] = [a.lastLogin, b.lastLogin]; break;
        case 'organization': [propA, propB] = [a.affiliate.name, b.affiliate.name]; break;
        default: [propA, propB] = [a.lastName, b.lastName];
      }

      let valueA = isNaN(+propA) ? propA : +propA;
      let valueB = isNaN(+propB) ? propB : +propB;

      if (this.sort.active === 'lastLogin') {
        valueA = new Date(<string>valueA).valueOf();
        valueB = new Date(<string>valueB).valueOf();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }



}
