import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core'
import { AffiliateService } from './affiliate/affiliate.service'
import { AnnouncementService } from './announcement/announcement.service'
import { AuthService, JWTService } from './auth/auth.service'
import { CountriesService } from './countries/countries.service'
import { FacilitatorService } from './facilitator/facilitator.service'
import { RouterService } from './router/router.service'
import { SupportService } from './support/support.service'
import { WorkshopFilterFactory } from './filters/workshops/workshop-filter-factory.service'
import { FacilitatorFilterFactory } from './filters/facilitators/facilitator-filter-factory.service'
import { DataProviderFactory } from './data-provider/data-provider-factory.service'
import { IsValidGuard } from './auth/is-valid.guard'
import { UserResolver } from './auth/user.resolver'
import { IsAdminGuard } from './auth/is-admin.guard'

@NgModule()
export class ServicesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        JWTService,
        AnnouncementService,
        AuthService,
        CountriesService,
        FacilitatorService,
        RouterService,
        SupportService,
        AffiliateService,
        WorkshopFilterFactory,
        FacilitatorFilterFactory,
        DataProviderFactory,
        IsValidGuard,
        UserResolver,
        IsAdminGuard,
      ],
    }
  }
}
