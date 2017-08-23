// Angular Modules
import { MdPaginator, MdSort } from '@angular/material';

// App Modules
import { FacilitatorService } from './facilitator.service';
import { DataProvider } from '../data-provider.service';
import { APIDataSource } from '../api-data-source.abstract.service';
import { Facilitator } from "../../facilitators/Facilitator";


export class FacilitatorDataSource extends APIDataSource<FacilitatorService, Facilitator>{

   constructor(
      private _fdp: DataProvider<FacilitatorService, Facilitator>,
      public paginator?: MdPaginator,
      public sort?: MdSort
   ) { super(_fdp, paginator, sort); }

   protected getSortedData(): Facilitator[] {
      const data = this._fdp.data.slice();

      if (!this.sort.active || this.sort.direction == '') { return data; }

      return data.sort((a, b) => {
         let propA: number | string = '';
         let propB: number | string = '';

         switch (this.sort.active) {
            case 'name': [propA, propB] = [a.name, b.name]; break;
            default: [propA, propB] = [a.name, b.name]
         }

         let valueA = isNaN(+propA) ? propA : +propA;
         let valueB = isNaN(+propB) ? propB : +propB;

         return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
      });
   }

   

}
