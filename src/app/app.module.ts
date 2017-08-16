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

export const appRoutes: Routes = [
  { path: 'workshop/new', component: AddWorkshopComponent },
  { path: 'workshop/:id', component: WorkshopComponent, resolve: { workshop: WorkshopResolver } }
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
    AddWorkshopComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    CookieModule.forRoot(),
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
    AffiliateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
