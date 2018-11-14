import { Injectable } from '@angular/core'

import { DataProvider } from './data-provider.service'
import { WorkshopService } from '../workshop/workshop.service'
import { Workshop } from '../../workshops/workshop.model'
import { AffiliateService } from '../affiliate/affiliate.service'

import { Affiliate } from '../../affiliates/affiliate.model'
import { FacilitatorService } from '../facilitator/facilitator.service'
import { Facilitator } from '../../facilitators/facilitator.model'
import { RouterService } from '../router/router.service'

@Injectable({
  providedIn: 'root',
})
export class DataProviderFactory {
  constructor(
    public _ws: WorkshopService,
    public _as: AffiliateService,
    public _fs: FacilitatorService,
    public router: RouterService,
  ) {}

  public getWorkshopDataProvider(): DataProvider<WorkshopService, Workshop> {
    return new DataProvider<WorkshopService, Workshop>(this._ws)
  }

  public getAffiliateDataProvider():
    | DataProvider<AffiliateService, Affiliate>
    | undefined {
    try {
      return new DataProvider<AffiliateService, Affiliate>(this._as)
    } catch (error) {
      console.warn(
        'Caught error in factory method: getAffiliateDataProvider()',
        error,
      )
      if (error.status === 403) {
        if (error.error === 'ACCESS_FORBIDDEN')
          this.router.navigateRoutes(['/403'])
        else this.router.navigateRoutes(['/login', '/admin'])
      }
    }
  }

  public getFacilitatorDataProvider(): DataProvider<
    FacilitatorService,
    Facilitator
  > {
    return new DataProvider<FacilitatorService, Facilitator>(this._fs)
  }
}
