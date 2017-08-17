import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { MdNativeDateModule, MdDatepickerModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

/** Workshops  */
import { WorkshopComponent } from './workshops/workshop/workshop.component';
import { WorkshopDataTableComponent } from './workshops/workshop-data-table/workshop-data-table.component';
import { WorkshopFormComponent } from './workshops/workshop-form/workshop-form.component';
import { WorkshopService } from './workshops/workshop.service';
import { WorkshopResolver } from './workshops/workshop.resolver';

/** Facilitators */
import { FacilitatorComponent } from './facilitators/facilitator/facilitator.component';
import { FacilitatorDataTableComponent } from './facilitators/facilitator-data-table/facilitator-data-table.component';
import { FacilitatorFormComponent } from './facilitators/facilitator-form/facilitator-form.component';
import { FacilitatorService } from './facilitators/facilitator.service';

/** Affiliates */
import { AffiliateComponent } from './affiliates/affiliate/affiliate.component';
import { AffiliateDataTableComponent } from './affiliates/affiliate-data-table/affiliate-data-table.component';
import { AffiliateFormComponent } from './affiliates/affiliate-form/affiliate-form.component';
import { AffiliateService } from './affiliates/affiliate.service';
import { AddWorkshopComponent } from './workshops/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './workshops/edit-workshop/edit-workshop.component';

/** Interface Components */
import { DashboardComponent } from './interface-components/dashboard/dashboard.component';
import { LoginComponent } from './interface-components/login/login.component';
import { FormsEvalsComponent } from './interface-components/materials/forms-evals/forms-evals.component';
import { MarketingMaterialsComponent } from './interface-components/materials/marketing-materials/marketing-materials.component';
import { WorkshopMaterialsComponent } from './interface-components/materials/workshop-materials/workshop-materials.component';
import { ProfileComponent } from './interface-components/profile/profile.component';
import { QuickDetailsComponent } from './interface-components/quick-details/quick-details.component';
import { QuickDetailItemComponent } from './interface-components/quick-details/quick-detail-item/quick-detail-item.component';
import { SupportComponent } from './interface-components/support/support.component';
import { SupportTrainingComponent } from './interface-components/support/support-training/support-training.component';
import { AnnouncementService, SidenavService, SupportService} from './interface-components/providers';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workshop/new', component: AddWorkshopComponent },
  { path: 'workshop/:id/edit', component: EditWorkshopComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'workshop/:id', component: WorkshopComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/training', component: SupportTrainingComponent },
  { path: 'support/training/:video', component: SupportTrainingComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    WorkshopComponent,
    WorkshopDataTableComponent,
    WorkshopFormComponent,
    FacilitatorComponent,
    FacilitatorDataTableComponent,
    FacilitatorFormComponent,
    AffiliateComponent,
    AffiliateDataTableComponent,
    AffiliateFormComponent,
    AddWorkshopComponent,
    EditWorkshopComponent,
    DashboardComponent,
    LoginComponent,
    FormsEvalsComponent,
    MarketingMaterialsComponent,
    WorkshopMaterialsComponent,
    ProfileComponent,
    QuickDetailItemComponent,
    QuickDetailsComponent,
    SupportComponent,
    SupportTrainingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CdkTableModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule
  ],
  providers: [
    WorkshopService,
    WorkshopResolver,
    FacilitatorService,
    AffiliateService,
    AnnouncementService,
    SidenavService,
    SupportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
