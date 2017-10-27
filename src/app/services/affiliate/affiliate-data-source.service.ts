// Angular Modules
import { MatPaginator, MatSort } from '@angular/material';

// App Modules
import { AffiliateService } from './affiliate.service';
import { DataProvider } from '../data-provider/data-provider.service';
import { APIDataSource } from '../api/api-data-source.abstract.service';
import { Affiliate } from '../../affiliates/affiliate.model';


export class AffiliateDataSource extends APIDataSource<AffiliateService, Affiliate> {

  constructor(
    public _adp: DataProvider<AffiliateService, Affiliate>,
    public paginator?: MatPaginator,
    public sort?: MatSort
  ) { super(_adp, paginator, sort); }

  protected getSortedData(): Affiliate[] {
    const data = this._adp.data.slice();

    if (!this.sort.active || this.sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propA: number | string = '';
      let propB: number | string = '';

      switch (this.sort.active) {
        case 'name': [propA, propB] = [a.name, b.name]; break;
        case 'website': [propA, propB] = [a.website, b.website]; break;
        default: [propA, propB] = [a.name, b.name];
      }

      const valueA = isNaN(+propA) ? propA : +propA;
      const valueB = isNaN(+propB) ? propB : +propB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }

}
