// Angular Modules
import { MdPaginator, MdSort } from '@angular/material';

// App Modules
import { AffiliateService } from './affiliate.service';
import { DataProvider } from '../data-provider.service';
import { APIDataSource } from '../api-data-source.abstract.service';
import { Affiliate } from "../../affiliates/Affiliate";


export class AffiliateDataSource extends APIDataSource<AffiliateService, Affiliate>{

   constructor(
      private _adp: DataProvider<AffiliateService, Affiliate>,
      public paginator?: MdPaginator,
      public sort?: MdSort
   ) { super(_adp, paginator, sort); }

   protected getSortedData(): Affiliate[] {
      const data = this._adp.data.slice();

      if (!this.sort)
         return data;

      if (!this.sort.active || this.sort.direction == '') { return data; }

      return data.sort((a, b) => {
         let propA: number | string = '';
         let propB: number | string = '';

         switch (this.sort.active) {
            case 'name': [propA, propB] = [a.name, b.name]; break;
            case 'website': [propA, propB] = [a.website, b.website]; break;
            default: [propA, propB] = [a.name, b.name]
         }

         let valueA = isNaN(+propA) ? propA : +propA;
         let valueB = isNaN(+propB) ? propB : +propB;

         return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
      });
   }

}
