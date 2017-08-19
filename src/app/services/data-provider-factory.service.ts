import { Injectable } from '@angular/core';

import { DataProvider } from './data-provider.service';
import { HttpService } from './http/http.service';
import { WorkshopService } from './workshop/workshop.service';
import { Workshop } from '../workshops/Workshop';

@Injectable()
export class DataProviderFactory {


  constructor(private http: HttpService, private _ws: WorkshopService) { }

  public getWorkshopDataProvider(): DataProvider<WorkshopService, Workshop> {
    return new DataProvider<WorkshopService, Workshop>(this._ws);
  }

}
