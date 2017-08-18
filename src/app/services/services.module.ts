import { NgModule, ModuleWithProviders } from '@angular/core';
import { AffiliateService } from './affiliate/affiliate.service';
import { AnnouncementService, Announcement } from './announcement/announcement.service';
import { AuthService } from './auth/auth.service';
import { CountriesService } from './countries/countries.service';
import { FacilitatorService } from './facilitator/facilitator.service';
import { HttpService } from './http/http.service';
import { RouterService } from './router/router.service';
import { SidenavService } from './sidenav/sidenav.service';
import { SupportService, Video } from './support/support.service';
import { WorkshopService } from './workshop/workshop.service';
import { WorkshopDataProvider } from './workshop/workshop-data-provider.service';
import { WorkshopFilterFactory } from './filters/workshops/workshop-filter-factory.service';

@NgModule()
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
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
        WorkshopDataProvider
      ]
    }
  }
}
