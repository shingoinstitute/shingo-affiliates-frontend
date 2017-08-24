import { Injectable } from '@angular/core';

import { DataProvider } from './data-provider.service';
import { HttpService } from './http/http.service';
import { WorkshopService } from './workshop/workshop.service';
import { Workshop } from '../workshops/Workshop';
import { AffiliateService } from "./affiliate/affiliate.service";
import { Affiliate } from "../affiliates/Affiliate";
import { FacilitatorService } from "./facilitator/facilitator.service";
import { Facilitator } from "../facilitators/Facilitator";

@Injectable()
export class DataProviderFactory {
  
  constructor(private http: HttpService, private _ws: WorkshopService, private _as: AffiliateService, private _fs: FacilitatorService) { }

  public getWorkshopDataProvider(): DataProvider<WorkshopService, Workshop> {
    return new DataProvider<WorkshopService, Workshop>(this._ws);
  }

  public getAffiliateDataProvider(): DataProvider<AffiliateService, Affiliate> {
    return new DataProvider<AffiliateService, Affiliate>(this._as);
  }

  public getFacilitatorDataProvider(): DataProvider<FacilitatorService, Facilitator> {
    return new DataProvider<FacilitatorService, Facilitator>(this._fs);
  }

}
