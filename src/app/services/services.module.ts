import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { AffiliateService } from './affiliate/affiliate.service';
import { AnnouncementService, Announcement } from './announcement/announcement.service';
import { AuthService } from './auth/auth.service';
import { CountriesService } from './countries/countries.service';
import { FacilitatorService } from './facilitator/facilitator.service';
import { HttpService } from './http/http.service';
import { RouterService } from './router/router.service';
import { SidenavService } from './sidenav/sidenav.service';
import { SupportService } from './support/support.service';
import { WorkshopService } from './workshop/workshop.service';
import { WorkshopFilterFactory } from './filters/workshops/workshop-filter-factory.service';
import { Workshop } from '../workshops/workshop.model';
import { DataProviderFactory } from './data-provider/data-provider-factory.service';
import { IsValidResolver } from './auth/is-valid.resolver';
import { UserResolver } from './auth/user.resolver';

@NgModule()
export class ServicesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        HttpService,
        AnnouncementService,
        AuthService,
        CountriesService,
        FacilitatorService,
        RouterService,
        SidenavService,
        SupportService,
        AffiliateService,
        WorkshopService,
        WorkshopFilterFactory,
        DataProviderFactory,
        IsValidResolver,
        UserResolver
      ]
    };
  }
}
